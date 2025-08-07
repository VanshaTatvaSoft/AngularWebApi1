import { GenericInputInterface } from "./GenericInputInterface";

export interface GenericFormInterface {
  fields: GenericInputInterface[];
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
}