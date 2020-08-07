import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }
  ngOnInit() { 
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm =  this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
     }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch' : true};
  }

  register() {
    if (this.registerForm.valid)
    {
      this.model.username = this.registerForm.get('username').value;
      this.model.email = this.registerForm.get('email').value;
      this.model.password = this.registerForm.get('password').value;
      console.log(this.model);
      this.authService.register(this.model).subscribe(next => {
        this.alertify.success('registration succesfull');
        },
        error => {
          this.alertify.error(error);
          console.log(error);
        },
        () => {
          this.authService.login(this.model).subscribe(() =>
          {
            this.router.navigate(['/field']);
          })
        }
    );
    }

    console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log("canceled");
  }
}
