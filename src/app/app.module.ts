import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faAddressBook,
  faUser,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
  faAsterisk,
  faVcard,
  faBars,
  faBirthdayCake,
  faBlog,
  faFileInvoice,
  faFileInvoiceDollar,
  faBookOpen,
  faBuilding,
  faCalendarAlt,
  faChartLine,
  faCheck,
  faCheckCircle,
  faCircle,
  faClock,
  faKey,
  faCog,
  faConciergeBell,
  faCopy,
  faDatabase,
  faDollarSign,
  faDoorClosed,
  faDotCircle,
  faDownload,
  faEdit,
  faEllipsisH,
  faEnvelope,
  faExclamation,
  faExclamationTriangle,
  faExpandAlt,
  faRocket,
  faExpandArrowsAlt,
  faEye,
  faFileImage,
  faFileInvoiceDollar,
  faFilePdf,
  faFolder,
  faFolderOpen,
  faGrinSquintTears,
  faHome,
  faIdCard,
  faImages,
  faInfo,
  faLanguage,
  faMailBulk,
  faMoneyBill,
  faMoneyBillWave,
  faPhone,
  faPlus,
  faProjectDiagram,
  faQrcode,
  faQuestionCircle,
  faInfoCircle,
  faSave,
  faSignInAlt,
  faSignOutAlt,
  faStar,
  faStarHalf,
  faStarHalfAlt,
  faSync,
  faTasks,
  faTimes,
  faToolbox,
  faTrash,
  faTrashRestore,
  faUniversity,
  faUnlockAlt,
  faUpload,
  faUserClock,
  faUserCog,
  faUserSecret,
  faWindowClose,
  faFileCode,
  faBold,
  faListOl,
  faItalic,
  faWarning,
  faCalendar,
  faArrows,
  faArrowsSplitUpAndLeft,
  faArrowsUpDown,
} from '@fortawesome/free-solid-svg-icons';

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { LayoutModule } from '@feature/layout/layout.module';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initialize } from './init/app-init.factory';
import { ConfigInitService } from './init/config-init.service';

registerLocaleData(localeDe, 'de');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    LayoutModule,
    KeycloakAngularModule,
    HighlightModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    ConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // font awesome
    library.addIcons(
      faEdit,
      faVcard,
      faAsterisk,
      faUser,
      faKey,
      faArrowLeft,
      faIdCard,
      faAddressBook,
      faFileCode,
      faBold,
      faListOl,
      faItalic,
      faArrows,
      faArrowsUpDown,
      faArrowsSplitUpAndLeft,
      faCalendar,
      faPhone,
      faBirthdayCake,
      faMailBulk,
      faRocket,
      faBookOpen,
      faDoorClosed,
      faClock,
      faUserClock,
      faCopy,
      faSave,
      faInfo,
      faDollarSign,
      faTasks,
      faInfoCircle,
      faCalendar,
      faQuestionCircle,
      faMoneyBill,
      faEnvelope,
      faExclamation,
      faBookOpen,
      faGrinSquintTears,
      faUnlockAlt,
      faEye,
      faArrowDown,
      faArrowUp,
      faImages,
      faTimes,
      faConciergeBell,
      faExpandAlt,
      faExpandArrowsAlt,
      faCalendarAlt,
      faQrcode,
      faLanguage,
      faProjectDiagram,
      faMoneyBillWave,
      faChartLine,
      faFolder,
      faFolderOpen,
      faUserSecret,
      faFileInvoiceDollar,
      faBlog,
      faUniversity,
      faCheck,
      faExclamationTriangle,
      faSync,
      faDotCircle,
      faCircle,
      faDatabase,
      faUpload,
      faSignInAlt,
      faWindowClose,
      faEllipsisH,
      faFileImage,
      faStar,
      faStarHalf,
      faStarHalfAlt,
      faBuilding,
      faBars,
      faSignOutAlt,
      faHome,
      faToolbox,
      faUserCog,
      faCheckCircle,
      faLinkedin,
      faWarning,
      faDownload,
      faGithub,
      faPlus,
      faCog,
      faTrash,
      faFilePdf,
      faTrashRestore
    );
  }
}
