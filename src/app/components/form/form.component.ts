import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() initialData: any;
  form: FormGroup;
  isLoading = false;

  @Output() emmitter: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      reporter: this.formBuilder.group({
        relationToInsured: ['', Validators.required],
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        phone: [''],
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        country: ['United States'],
        postalCode: ['']
      }),
      policy: this.formBuilder.group({
        policyNumber: ['', Validators.required],
        contactSameAsReporter: [false, Validators.required],
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        phone: [''],
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        country: ['United States'],
        postalCode: ['']
      })
    });


    this.form?.get('policy.contactSameAsReporter')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get('policy.title')?.disable();
        this.form.get('policy.firstName')?.disable();
        this.form.get('policy.lastName')?.disable();
        this.form.get('policy.email')?.disable();
        this.form.get('policy.phone')?.disable();
        this.form.get('policy.addressOne')?.disable();
        this.form.get('policy.addressTwo')?.disable();
        this.form.get('policy.city')?.disable();
        this.form.get('policy.state')?.disable();
        this.form.get('policy.country')?.disable();
        this.form.get('policy.postalCode')?.disable();
      } else {
        this.form.get('policy.title')?.enable();
        this.form.get('policy.firstName')?.enable();
        this.form.get('policy.lastName')?.enable();
        this.form.get('policy.email')?.enable();
        this.form.get('policy.phone')?.enable();
        this.form.get('policy.addressOne')?.enable();
        this.form.get('policy.addressTwo')?.enable();
        this.form.get('policy.city')?.enable();
        this.form.get('policy.state')?.enable();
        this.form.get('policy.country')?.enable();
        this.form.get('policy.postalCode')?.enable();
      }
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.emmitter.emit(this.form.value);
      console.log('Submitted with value: ' + JSON.stringify(this.form.value));
    }
  }

}
