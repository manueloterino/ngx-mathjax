import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MathJaxModule } from './math-jax/math-jax.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DummyComponent } from './dummy/dummy.component';
import { DemoComponent } from './demo/demo.component';
import { MarkdownModule } from 'ngx-markdown';
import { ModuleDemoModule } from './module-demo/module-demo.module';

/**
 * @ignore
 */
@NgModule({
  declarations: [AppComponent, DummyComponent, DemoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MathJaxModule.forRoot(
      {
        version: '2.7.5',
        config: 'TeX-AMS_HTML',
        hostname: 'cdnjs.cloudflare.com',
      },
      {
        tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      },
    ),
    MarkdownModule.forRoot(),
    AppRoutingModule,
    ModuleDemoModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
