/*import { IMailService } from "./serviceInterface/IMailService";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class MailService implements IMailService {
  private _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    await this._transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  }
}*/
import { IMailService } from "./serviceInterface/IMailService";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export class MailService implements IMailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!, 
      subject,
      text,
      html,
    });
  }
}

