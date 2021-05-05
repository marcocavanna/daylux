import { Injectable, Logger } from '@nestjs/common';

import { existsSync, writeFileSync, writeFile, readFileSync } from 'fs';

import { resolve } from 'path';
import * as yaml from 'js-yaml';

import dotProp from 'dot-prop';
import deepmerge from 'deepmerge';

import type {
  Path,
  FieldPathValue,
  Config
} from 'daylux-interfaces';

import { defaultConfig } from './config.defaults';


@Injectable()
export class ConfigService {

  private readonly logger: Logger = new Logger('ConfigService');

  private readonly filePath: string = resolve(__dirname, '..', '..', 'daylux.config.yml');

  private readonly store: Config;


  constructor() {
    /** Check initial config exists */
    if (!existsSync(this.filePath)) {
      this.logger.verbose('Default yml config file not found. Create new one');
      this.saveStore(defaultConfig, { sync: true });
    }

    /** Load the YML Config file */
    let savedStore: Config;

    try {
      savedStore = yaml.load(readFileSync(this.filePath, 'utf-8')) as Config;
    }
    catch {
      savedStore = defaultConfig;
    }

    /** Deep merge savedStore with default */
    this.store = deepmerge<Config>(defaultConfig, savedStore);

    /** Refresh saved file */
    this.saveStore(savedStore, { sync: true });
  }


  private saveStore(data: Config, options?: { sync?: boolean }): void {
    try {
      /** Deserialized Object */
      const ymlConfig = yaml.dump(data);

      /** Save file */
      if (options?.sync) {
        writeFileSync(this.filePath, ymlConfig, 'utf-8');
        this.logger.verbose('Saved yml config path in sync mode');
      }
      else {
        writeFile(this.filePath, ymlConfig, 'utf-8', () => {
          this.logger.verbose('Saved yml config in Async mode');
        });
      }
    }
    catch (error) {
      this.logger.error('Error saving yml config file.', error);
    }
  }


  public getAll(): Config {
    return this.store;
  }


  public get<TPath extends Path<Config>>(path: TPath): FieldPathValue<Config, TPath> {
    const value = dotProp.get(this.store, path);

    if (value === undefined) {
      const error = new Error(`You are trying to access to '${path}' value, but it is undefined`);
      this.logger.error(error);
      throw error;
    }

    return value as FieldPathValue<Config, TPath>;
  }


  public set<TPath extends Path<Config>>(path: TPath, value: FieldPathValue<Config, TPath>): void {
    /** Set the new value */
    dotProp.set(this.store, path, value);
    /** Save settings */
    this.saveStore(this.store);
  }

}
