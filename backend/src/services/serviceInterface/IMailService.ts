
export interface IMailService {
  sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void>;
}
