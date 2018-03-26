export interface IEmail {
  firstName: string;
  lastName: string;
  email: string;
  type: 'JOB' | 'COOPERATION' | 'CONTACT';
  subject?: string;
  message?: string;
  address?: string;
  phone?: string;
  position?: string;
  attachments?: any;
  companyName?: string;
  documentPolicy?: boolean;
}
