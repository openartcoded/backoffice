import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MenuLink {
  readonly id?: string;
  readonly updatedDate?: Date | string;
  order?: number;
  show?: boolean;
  description?: string;
  title: string;
  routerLinkActiveOptions: any;
  icon: IconProp;
  routerLink: any[];
  numberOfTimesClicked?: number;
  roles: string[];
}
