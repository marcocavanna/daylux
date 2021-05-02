import * as React from 'react';

import ButterToast, { RaiseParam } from 'butter-toast';

import Toast, { ToastProps } from '@appbuckets/react-ui/Toast';


function isObject(val: any) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}


/* --------
 * Notification Manager Type and Interfaces
 * -------- */
export type NotificationContent =
  | string
  | React.ReactNode
  | React.ComponentType<ToastProps>
  | ToastProps;


/* --------
 * Create the TrayManager
 * -------- */
class NotificationManager {

  /* --------
   * Constructor Function
   * -------- */
  constructor(
    private readonly namespace: string,
    private readonly Component: React.ComponentType<ToastProps>,
    private readonly defaultProps?: Partial<ToastProps>
  ) {
  }


  /* --------
   * Show Function
   * -------- */
  private show(content?: NotificationContent, options?: Partial<RaiseParam>, overrideProps?: Partial<ToastProps>) {

    if (content instanceof Error) {
      this.show({
        header : content.name,
        content: content.message
      }, options, overrideProps);
      return;
    }

    /** Cast string content to toast props */
    const ComponentProps: ToastProps | React.ComponentType<ToastProps> | undefined = (typeof content === 'string'
      ? { header: content }
      : content) as ToastProps | React.ComponentType<ToastProps> | undefined;

    /** Build base toast props */
    const baseToastProps: ToastProps = {
      ...this.defaultProps,
      ...overrideProps
    };

    /** If toast props is a function assume is a ComponentType */
    if (typeof ComponentProps === 'function') {
      ButterToast.raise({
        namespace: this.namespace,
        timeout  : 6000,
        ...options,
        content: (props) => {

          const handleDismiss = () => {
            if (props.dismiss && baseToastProps.dismissible) {
              props.dismiss();
            }
          };

          return <ComponentProps {...baseToastProps} dismiss={handleDismiss} />;
        }
      });

      return;
    }

    /**
     * If content is not a valid Notification Content
     * (eg. has is nil), stop the notification
     * show process and return
     */
    if (!isObject(ComponentProps)) {
      return;
    }

    /**
     * Build the Toast Props, using defaultProps
     * and overridden Props
     */
    const toastProps: ToastProps = {
      ...this.defaultProps,
      ...ComponentProps,
      ...overrideProps
    };

    /**
     * Assert at least one of the toast props
     * used to show the message exists
     */
    if (!toastProps.header && !toastProps.content) {
      return;
    }

    const { Component } = this;

    /** Raise the Notification */
    ButterToast.raise({
      namespace: this.namespace,
      timeout  : 6000,
      ...options,
      content: (props) => {

        const handleDismiss = () => {
          if (props.dismiss && toastProps.dismissible) {
            props.dismiss();
          }
        };

        return <Component {...toastProps} dismiss={handleDismiss} />;
      }
    });
  }


  default = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times' })
  );

  error = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', danger: true, icon: 'times-circle' })
  );

  info = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', info: true, icon: 'info' })
  );

  primary = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', primary: true })
  );

  secondary = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', secondary: true })
  );

  success = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', success: true, icon: 'check' })
  );

  warning = (props: NotificationContent, options?: Partial<RaiseParam>) => (
    this.show(props, options, { dismissible: 'times', warning: true, icon: 'exclamation-circle' })
  );

}

const ToastController = new NotificationManager('toast-container', Toast);

export { ToastController as Toast };
