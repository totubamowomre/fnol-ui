import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from '../components/session-expired-dialog/session-expired-dialog.component';
import { SessionReminderDialogComponent } from '../components/session-reminder-dialog/session-reminder-dialog.component';
import { environment } from 'src/environments/environment';
import { EmailTooLargeDialogComponent } from '../components/email-too-large-dialog/email-too-large-dialog.component';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
})
export class FormPageComponent implements OnInit {
  private sessionKey!: string | null;
  data!: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sessionService: SessionService,
  ) {
    this.sessionService.currentSessionReminder.subscribe(shouldRemind => {
      if (shouldRemind && this.dialog.openDialogs.length === 0 && this.router.url === '/form') {
        this.openSessionReminderDialog();
      }
    });

    this.sessionService.currentSessionState.subscribe(isActive => {
      if (!isActive && this.dialog.openDialogs.length === 0 && this.router.url === '/form') {
        this.openSessionExpiredDialog();
      }
    });
  }

  openSessionReminderDialog(): void {
    this.dialog.open(SessionReminderDialogComponent, {});
  }

  openSessionExpiredDialog(): void {
    this.dialog
      .open(SessionExpiredDialogComponent, {})
      .afterClosed()
      .subscribe(_result => {
        this.router.navigate(['']);
      });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  formatDateUS(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  indentText(text: string, indentLength: number): string {
    const indentSpace = ' '.repeat(indentLength);
    return text.split('\n').join(`\n${indentSpace}`);
  }

  async handleFormSubmit(data: any) {
    if (!this.sessionKey) {
      throw new Error('Invalid FNOL ID');
    }
    this.data = data;
    SessionService.setSessionData(data);
    let fnolId = this.sessionKey;

    const emailBody = this.generateEmailBody(data);

    const emailLink = await this.constructEmailLink(emailBody);

    // Open the default mail client
    window.open(emailLink, '_blank');

    const clippedEmailBody = emailBody.substring(emailBody.indexOf('\n') + 1);
    this.router.navigate(['/confirmation'],{ state: { fnolId: fnolId, emailBody: clippedEmailBody, emailLink: emailLink } })
  }

  generateEmailBody(formData: any): string {
    let emailBody = `Generated by MRSI Claims FNOL Portal - Reference: ${this.sessionKey}.\n`;
    emailBody += `Reported by:\n`;
    if (formData.reporter.relationToInsured != "") {
      emailBody += `  Role in Relation to Loss: ${formData.reporter.relationToInsured}\n`;
    }
    if (formData.reporter.title != "") {
      emailBody += `  Title: ${formData.reporter.title}\n`;   
    }
    if (formData.reporter.firstName != "") {
      emailBody += `  First Name: ${formData.reporter.firstName}\n`;   
    }
    if (formData.reporter.lastName != "") {
      emailBody += `  Last Name: ${formData.reporter.lastName}\n`;
    }
    if (formData.reporter.lastName != "") {
      emailBody += `  Last Name: ${formData.reporter.lastName}\n`;
    }
    if (formData.reporter.phone != "") {
      emailBody += `  Phone: ${formData.reporter.phone}\n`;
    }
    if (formData.reporter.email != "") {
      emailBody += `  Email: ${formData.reporter.email}\n`;
    }
    if (formData.reporter.addressOne != "") {
      emailBody += `  Address 1: ${formData.reporter.addressOne}\n`;
    }
    if (formData.reporter.addressTwo != "") {
      emailBody += `  Address 2: ${formData.reporter.addressTwo}\n`;
    }
    if (formData.reporter.city != "") {
      emailBody += `  City: ${formData.reporter.city}\n`;
    }
    if (formData.reporter.state != "") {
      emailBody += `  State: ${formData.reporter.state}\n`;
    }
    if (formData.reporter.country != "") {
      emailBody += `  Country: ${formData.reporter.country}\n`;
    }
    if (formData.reporter.customCountry != "") {
      emailBody += `  Country Name: ${formData.reporter.customCountry}\n`;
    } 
    if (formData.reporter.postalCode != "") {
      emailBody += `  Postal Code: ${formData.reporter.postalCode}\n`;
    }
    emailBody += `\n`;
    emailBody += `Insured Policy Information:\n`;
    emailBody += `  Policy Number: ${formData.policy.policyNumber}\n`;
    if (formData.policy.contactSameAsReporter) {
      emailBody += `  Same Contact and Address as Reported by: Yes\n`;
    } else {
      if (formData.policy.title != "") {
        emailBody += `  Title: ${formData.policy.title}\n`;
      }
      if (formData.policy.firstName != "") {
        emailBody += `  First Name: ${formData.policy.firstName}\n`;
      }
      if (formData.policy.lastName != "") {
        emailBody += `  Last Name: ${formData.policy.lastName}\n`;
      }
      if (formData.policy.phone != "") {
        emailBody += `  Phone: ${formData.policy.phone}\n`;
      }
      if (formData.policy.email != "") {
        emailBody += `  Email: ${formData.policy.email}\n`;
      }
      if (formData.policy.addressOne != "") {
        emailBody += `  Address 1: ${formData.policy.addressOne}\n`;
      }
      if (formData.policy.addressTwo != "") {
        emailBody += `  Address 2: ${formData.policy.addressTwo}\n`;
      }
      if (formData.policy.city != "") {
        emailBody += `  City: ${formData.policy.city}\n`;
      }
      if (formData.policy.state != "") {
        emailBody += `  State: ${formData.policy.state}\n`;
      }
      if (formData.policy.country != "") {
        emailBody += `  Country: ${formData.policy.country}\n`;
      }
      if (formData.policy.customCountry != "") {
        emailBody += `  Country Name: ${formData.policy.customCountry}\n`;
      } 
      if (formData.policy.postalCode != "") {
        emailBody += `  Postal Code: ${formData.policy.postalCode}\n`;
      }
    }

    // Loss Information
    emailBody += `\n`;
    emailBody += `Loss Information:\n`;
    emailBody += `  Date: ${this.formatDateUS(formData.loss.date)}\n`;
    emailBody += `  Description: ${this.indentText(formData.loss.description, 21)}\n`;
    if (formData.loss.lossLocation === 'SameAsReporter') {
      emailBody += `  loss location: Same as Reported by\n`;
    } else if (formData.loss.lossLocation === 'SameAsInsured') {
      emailBody += `  loss location: Same as Insured\n`;
    } else {
      if (formData.loss.lossAddress.addressOne != "") {
        emailBody += `  Address 1: ${formData.loss.lossAddress.addressOne}\n`;
      }
      if (formData.loss.lossAddress.addressTwo != "") {
        emailBody += `  Address 2: ${formData.loss.lossAddress.addressTwo}\n`;
      }
      if (formData.loss.lossAddress.city != "") {
        emailBody += `  City: ${formData.loss.lossAddress.city}\n`;
      }
      if (formData.loss.lossAddress.state != "") {
        emailBody += `  State: ${formData.loss.lossAddress.state}\n`;
      }
      if (formData.loss.lossAddress.country != "") {
        emailBody += `  Country: ${formData.loss.lossAddress.country}\n`;
      }
      if (formData.loss.lossAddress.customCountry != "") {
        emailBody += `  Country Name: ${formData.loss.lossAddress.customCountry}\n`;
      }
      if (formData.loss.lossAddress.postalCode != "") {
        emailBody += `  Postal Code: ${formData.loss.lossAddress.postalCode}\n`;
      }
    }
    emailBody += `  Were Authorities Notified?: ${formData.loss.areAuthoritiesNotified}\n`;
    if (formData.loss.areAuthoritiesNotified === 'Yes') {
      if (formData.loss.authorityType != "") {
        emailBody += `    Type: ${formData.loss.authorityType}\n`;
      }
      if (formData.loss.authorityReportNumber != "") {
        emailBody += `    Report Number: ${formData.loss.authorityReportNumber}\n`;
      }
      if (formData.loss.authorityAdditionalInformation != "") {
        emailBody += `    Description: ${this.indentText(formData.loss.authorityAdditionalInformation, 22)}\n`;
      }      
    }
    emailBody += `  Any Witness of Loss: ${formData.loss.anyWitnessOfLoss}\n`;
    formData.loss.witnesses.forEach((witness: any, index: number) => {
      emailBody += `  Witness ${index + 1}:\n`;
      if (witness.title != "") {
        emailBody += `    Title: ${witness.title}\n`;
      }
      if (witness.firstName != "") {
        emailBody += `    First Name: ${witness.firstName}\n`;
      }
      if (witness.lastName != "") {
        emailBody += `    Last Name: ${witness.lastName}\n`;
      }
      if (witness.email != "") {
        emailBody += `    Email: ${witness.email}\n`;
      }
      if (witness.phone != "") {
        emailBody += `    Phone: ${witness.phone}\n`;
      }
      if (witness.addressOne != "") {
        emailBody += `    Address 1: ${witness.addressOne}\n`;
      }
      if (witness.addressTwo != "") {
        emailBody += `    Address 2: ${witness.addressTwo}\n`;
      }
      if (witness.city != "") {
        emailBody += `    City: ${witness.city}\n`;
      }
      if (witness.state != "") {
        emailBody += `    State: ${witness.state}\n`;
      }
      if (witness.country != "") {
        emailBody += `    Country: ${witness.country}\n`;
      }
      if (witness.customCountry != "") {
        emailBody += `    Country Name: ${witness.customCountry}\n`;
      }
      if (witness.postalCode != "") {
        emailBody += `    Postal Code: ${witness.postalCode}\n`;
      }     
    });

    // Claimant Information
    emailBody += `\n`;
    emailBody += `Claimant Information:\n`;
    formData.claimant.claimants.forEach((claimant: any, index: number) => {
      emailBody += `  Claimant ${index + 1}:\n`;
      if (claimant.title != "") {
        emailBody += `    Title: ${claimant.title}\n`;
      }
      if (claimant.firstName != "") {
        emailBody += `    First Name: ${claimant.firstName}\n`;
      }
      if (claimant.lastName != "") {
        emailBody += `    Last Name: ${claimant.lastName}\n`;
      }
      if (claimant.email != "") {
        emailBody += `    Email: ${claimant.email}\n`;
      }
      if (claimant.phone != "") {
        emailBody += `    Phone: ${claimant.phone}\n`;
      }
      if (claimant.addressOne != "") {
        emailBody += `    Address 1: ${claimant.addressOne}\n`;
      }
      if (claimant.addressTwo != "") {
        emailBody += `    Address 2: ${claimant.addressTwo}\n`;
      }
      if (claimant.city != "") {
        emailBody += `    City: ${claimant.city}\n`;
      }
      if (claimant.state != "") {
        emailBody += `    State: ${claimant.state}\n`;
      }
      if (claimant.country != "") {
        emailBody += `    Country: ${claimant.country}\n`;
      }
      if (claimant.customCountry !== "") {
        emailBody += `    Country Name: ${claimant.customCountry}\n`;
      }
      if (claimant.postalCode != "") {
        emailBody += `    Postal Code: ${claimant.postalCode}\n`;
      }      
    });

    return emailBody;
  }

  async constructEmailLink(emailBody: string): Promise<string> {
    // Create the mailto link
     const subject = encodeURIComponent(this.formatDateUS(new Date())+"_FNOL Portal Request - Reference: "+ this.sessionKey);
    const baseMailto = `mailto:${environment.claimsMailbox}?subject=${subject}&body=`;
    let encodedEmailBody = encodeURIComponent(emailBody);
    // Check the total length of the URL
    if ((baseMailto + encodedEmailBody).length > 2000) {
      const clippedEmailBody = emailBody.substring(emailBody.indexOf('\n') + 1);
      await new Promise<boolean>(resolve => {
        const dialogRef = this.dialog.open(EmailTooLargeDialogComponent, {
          data: { emailBody: clippedEmailBody }
        });
        dialogRef.afterClosed().subscribe(userChoice => {
          console.log('userChoice' + userChoice);
          resolve(userChoice);
        });
      });
      encodedEmailBody = encodeURIComponent(`${emailBody.split('\n')[0]}\n<<Paste clipboard here>>\n`);
    }
    return baseMailto + encodedEmailBody;
  }


  ngOnInit(): void {
    // Fetch session key from sessionStorage if available
    if (SessionService.isSessionActive()) {
      this.sessionKey = SessionService.getSessionKey();
      this.data = SessionService.getSessionData();
    } else {
      this.sessionKey = history.state.sessionKey;
    }
  }
}

