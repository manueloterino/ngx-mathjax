/**
 * @author davidshen84
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathJaxDirective } from './math-jax.directive';
import { MathJaxService } from './math-jax.service';

/**
 * Module configuration class.
 *
 * @example
 *
 * {
 *   version: '2.7.5',
 *   config: 'TeX-AMS_HTML',
 *   hostname: 'cdnjs.cloudflare.com'
 * }
 */
export class ModuleConfiguration {
  /**
   * The version of the MathJax library.
   */
  version: string;

  /**
   * The config name of the MathJax library.
   * Please check the MathJax [documentation](https://docs.mathjax.org/en/latest/config-files.html) for all the configuration names.
   */
  config: string;

  /**
   * MathJax CDN hostname. Please check [here](https://docs.mathjax.org/en/latest/start.html#mathjax-cdn) for available CDN servers.
   */
  hostname: string;
}

export class MathJaxHubConfig implements MathJax.Config {}

/**
 * Module to load and configure the MathJax library.
 *
 * @example
 *
 * MathJaxModule.config(
 * {
 *     version: '2.7.5',
 *     config: 'TeX-AMS_HTML',
 *     hostname: 'cdnjs.cloudflare.com'
 * })
 */
@NgModule({
  declarations: [MathJaxDirective],
  imports: [CommonModule],
  exports: [MathJaxDirective],
})
export class MathJaxModule {
  constructor(
    service: MathJaxService,
    moduleConfig?: ModuleConfiguration,
    mathJaxHubConfig?: MathJaxHubConfig,
  ) {
    service.init();

    const hubConfig = mathJaxHubConfig ? mathJaxHubConfig : { skipStartupTypeset: true };
    /**
     * Define the **function string** to be inserted into the mathjax configuration script block.
     */
    let mathJaxHubConfigString = (() => {
      MathJax.Hub.Config({});
      MathJax.Hub.Register.StartupHook('End', () => {
        window.mathJaxHub$.next();
        window.mathJaxHub$.complete();
      });
    }).toString();
    mathJaxHubConfigString = mathJaxHubConfigString.replace(
      '({})',
      `(${JSON.stringify(hubConfig)})`,
    );

    if (moduleConfig) {
      /**
       * Insert the MathJax configuration script into the Head element.
       */
      (function() {
        const script = document.createElement('script') as HTMLScriptElement;
        script.type = 'text/x-mathjax-config';
        script.text = `(${mathJaxHubConfigString})();`;
        document.getElementsByTagName('head')[0].appendChild(script);
      })();

      /**
       * Insert the script block to load the MathJax library.
       */
      (function(version: string, config: string, hostname: string) {
        const script = document.createElement('script') as HTMLScriptElement;
        script.type = 'text/javascript';
        script.src = `https://${hostname}/ajax/libs/mathjax/${version}/MathJax.js?config=${config}`;
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);
      })(moduleConfig.version, moduleConfig.config, moduleConfig.hostname);
    }
  }

  /**
   * Configure the provider for hte module.
   *
   * @deprecated Use forRoot or forChild method instead.
   * @param forRoot Make sure it is set to `true` for the root module and `false` for any child module.
   * @param moduleConfiguration A {ModuleConfiguration} instance.
   */
  public static config(
    forRoot: boolean = true,
    moduleConfiguration: ModuleConfiguration = {
      version: '2.7.5',
      config: 'TeX-AMS_HTML',
      hostname: 'cdnjs.cloudflare.com',
    },
    mathJaxHubConfig: MathJaxHubConfig,
  ): ModuleWithProviders<MathJaxModule> {
    return forRoot
      ? {
          ngModule: MathJaxModule,
          providers: [
            { provide: ModuleConfiguration, useValue: moduleConfiguration },
            { provide: MathJaxHubConfig, useValue: mathJaxHubConfig },
            { provide: MathJaxService, useClass: MathJaxService },
          ],
        }
      : {
          ngModule: MathJaxModule,
        };
  }
  /**
   * Configure the module for the root module.
   *
   * @param moduleConfiguration A {ModuleConfiguration} instance.
   */
  public static forRoot(
    moduleConfiguration: ModuleConfiguration = {
      version: '2.7.5',
      config: 'TeX-AMS_HTML',
      hostname: 'cdnjs.cloudflare.com',
    },
    mathJaxHubConfig: MathJaxHubConfig,
  ): ModuleWithProviders<MathJaxModule> {
    return {
      ngModule: MathJaxModule,
      providers: [
        { provide: ModuleConfiguration, useValue: moduleConfiguration },
        { provide: MathJaxHubConfig, useValue: mathJaxHubConfig },
        { provide: MathJaxService, useClass: MathJaxService },
      ],
    };
  }

  /**
   * Configure the module for a child module.
   */
  public static forChild() {
    return {
      ngModule: MathJaxModule,
    };
  }
}
