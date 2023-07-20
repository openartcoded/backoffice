import { MenuLink } from '@core/models/settings';

export class FallbackMenu {
  static getDefault(): MenuLink[] {
    return [
      {
        id: '60083105215dd143d209d2c9',
        order: 0,
        updatedDate: '2021-01-21T07:23:45.020+00:00',
        title: 'Home',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'home'],
        routerLink: [''],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2cb',
        order: 0,
        updatedDate: '2022-01-04T11:41:10.195+00:00',
        title: 'Tasks',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'tasks'],
        routerLink: ['tasks'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2ca',
        order: 2,
        updatedDate: '2022-01-04T11:41:09.074+00:00',
        title: 'Timesheet',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'clock'],
        routerLink: ['timesheets'],
        show: false,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d5',
        order: 3,
        updatedDate: '2021-01-24T06:07:21.395+00:00',
        title: 'Expenses',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'money-bill-wave'],
        routerLink: ['fee'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d3',
        order: 4,
        updatedDate: '2021-01-21T07:10:14.492+00:00',
        title: 'Invoices',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'file-invoice-dollar'],
        routerLink: ['invoice'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d4',
        order: 5,
        updatedDate: '2021-01-21T07:10:17.119+00:00',
        title: 'Dossiers',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'folder-open'],
        routerLink: ['dossier'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2cc',
        order: 6,
        updatedDate: '2022-02-07T05:33:42.577+00:00',
        title: 'Documents',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'unlock-alt'],
        routerLink: ['documents'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d1',
        order: 8,
        updatedDate: '2022-02-07T05:33:42.411+00:00',
        title: 'Blog',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'blog'],
        routerLink: ['blog'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2cf',
        order: 9,
        updatedDate: '2022-02-07T05:33:34.366+00:00',
        title: 'Gallery',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'images'],
        routerLink: ['memzagram'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2ce',
        order: 10,
        updatedDate: '2021-01-21T07:10:42.351+00:00',
        title: 'CV',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'university'],
        routerLink: ['cv'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d6',
        order: 11,
        updatedDate: '2021-04-04T20:19:45.178+00:00',
        title: 'Finance',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'chart-line'],
        routerLink: ['finance'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2d8',
        order: 12,
        updatedDate: '2021-01-20T19:25:21.017+00:00',
        title: 'Uploads',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'upload'],
        routerLink: ['file-upload'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd193d209d3cd',
        order: 14,
        updatedDate: '2022-01-04T11:41:13.750+00:00',
        title: 'Sparql',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'database'],
        routerLink: ['endpoint-sparql'],
        show: true,
        numberOfTimesClicked: 0,
      },

      {
        id: '60083105215dd143d209d2d9',
        order: 16,
        updatedDate: '2022-01-04T11:41:22.006+00:00',
        title: 'Rdf',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'project-diagram'],
        routerLink: ['toolbox', 'rdf'],
        show: true,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2da',
        order: 17,
        updatedDate: '2022-01-04T11:39:31.915+00:00',
        title: 'Date',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'calendar-alt'],
        routerLink: ['toolbox', 'date'],
        show: false,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2db',
        order: 18,
        updatedDate: '2021-12-23T14:51:48.659+00:00',
        title: 'Base64',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'qrcode'],
        routerLink: ['toolbox', 'base64'],
        show: false,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2dc',
        order: 19,
        updatedDate: '2021-12-23T14:51:46.265+00:00',
        title: 'XPath/JSONPath',
        description: null,
        routerLinkActiveOptions: {
          exact: false,
        },
        icon: ['fas', 'language'],
        routerLink: ['toolbox', 'pathfinder'],
        show: false,
        numberOfTimesClicked: 0,
      },
      {
        id: '60083105215dd143d209d2cd',
        order: 20,
        updatedDate: '2022-01-08T05:03:35.418+00:00',
        title: 'Prospects',
        description: null,
        routerLinkActiveOptions: {
          exact: true,
        },
        icon: ['fas', 'concierge-bell'],
        routerLink: ['services'],
        show: true,
        numberOfTimesClicked: 0,
      },
    ];
  }
}
