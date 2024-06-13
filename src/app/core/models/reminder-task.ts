export interface ReminderTask {
  id?: string;
  inAppNotification?: boolean;
  dateCreation?: Date;
  calendarDate?: Date;
  lastExecutionDate?: Date;
  updatedDate?: Date;
  nextDate?: Date;
  specificDate?: Date;
  cronExpression?: string;
  title: string;
  description: string;
  disabled: boolean;
  sendMail?: boolean;
  sendSms?: boolean;
  persistResult?: boolean;
  actionKey?: string;
  customActionName?: string;
  actionParameters?: ActionParameter[];
}

export interface ActionParameter {
  key?: string;
  required?: boolean;
  value?: string;
  parameterType?: ActionParameterType;
  description?: string;
  options?: Map<string, string>;
}
export enum ActionParameterType {
  INTEGER,
  LONG,
  STRING,
  BOOLEAN,
  DOUBLE,
  BIGDECIMAL,
  BIGINTEGER,
  OPTION,
}

export enum StatusType {
  SUCCESS,
  FAILURE,
  UNKNOWN,
}

export interface ActionMetadata {
  key?: string;
  title?: string;
  description?: string;
  allowedParameters?: ActionParameter[];
  defaultCronValue?: string;
}

export interface ActionResult {
  status?: StatusType;
  actionKey?: string;
  id?: string;
  createdDate?: Date;
  finishedDate?: Date;
  startedDate?: Date;
  messages?: string[];
  parameters?: ActionParameter[];
}
