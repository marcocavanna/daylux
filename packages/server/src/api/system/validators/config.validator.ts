import { IsString, IsNotEmpty } from 'class-validator';

import { Path, Config } from 'daylux-interfaces';


export class ValidatedConfigPatch {

  @IsString()
  public field!: Path<Config>;

  @IsNotEmpty()
  public value!: any;

}
