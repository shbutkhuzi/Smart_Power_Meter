import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  public boolValid: boolean = true;
  
  public forms: FormGroup = new FormGroup({});
  public valid_1: boolean = true;
  public valid_2: boolean = true;
  private destr_0: any;
  private destr_1: any;
  private destr_2: any;
  private destr_3: any;
  public error_p_class = "register_error";

  public input_valid_1: string = "";
  public input_valid_2: string = "";
  public input_valid_3: string = "";


  constructor(
    private fb: FormBuilder,
    private _api: ApiService,
    private _router: Router,
    private user: UserService
  ) {
    this.forms = this.fb.group({
      full_name: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required, Validators.email]),
      Password: new FormControl("", [Validators.required]),
      isConnected: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.check();
    //==============
    this.destr_1 = this.forms
      .get("full_name")
      ?.valueChanges.subscribe((res) => {
        if (this.forms.get("full_name")?.status == "VALID") {
          this.input_valid_1 = "input-success";
        } else if (this.forms.get("full_name")?.status == "INVALID") {
          this.input_valid_1 = "input-warn";
        }
      });
    //======
    this.destr_2 = this.forms.get("Email")?.valueChanges.subscribe((res) => {
      if (this.forms.get("Email")?.status == "VALID") {
        this.input_valid_2 = "input-success";
      } else if (this.forms.get("Email")?.status == "INVALID") {
        this.input_valid_2 = "input-warn";
      }
    });
    //=====
    this.destr_3 = this.forms.get("Password")?.valueChanges.subscribe((res) => {
      if (this.forms.get("Password")?.status == "VALID") {
        this.input_valid_3 = "input-success";
      } else if (this.forms.get("Password")?.status == "INVALID") {
        this.input_valid_3 = "input-warn";
      }
    });
  }
  // parentComponentMethod_1(val: any) {
  //   (this.forms.get("full_name") as FormControl).patchValue(val);
  // }
  // parentComponentMethod_2(val: any) {
  //   (this.forms.get("Email") as FormControl).patchValue(val);
  // }
  // parentComponentMethod_3(val: any) {
  //   (this.forms.get("Password") as FormControl).patchValue(val);
  // }
  check() {
    this.destr_0 = (this.forms as FormGroup).statusChanges.subscribe(() => {
      if (
        this.forms.status == "VALID" 
        // && (this.forms.get("agree_terms") as FormControl).value == true
      ) {
        this.boolValid = false;
      } else this.boolValid = true;
    });
  }

  onSubmit() {
    const first_last_name = this.forms.value.full_name.split(" ");

    // this._api.GetUserWithEmail(this.forms.value["Email"]).subscribe((ans) => {
    //   if (ans[0] === null || ans[0] === undefined) {
    //     //when there is not user registered already
    //     this._api.SignUp(this.forms.value).subscribe(
    //       (res) => {
    //         this.forms.reset();
    //         this._router.navigate(["/sign-in"]);
    //       },
    //       (error) => {
    //         alert(error.error);
    //       }
    //     );
    //   } else {
    //     alert("User Already Exists");
    //   }
    // });
    this._api.SignUpPost(this.forms.value).subscribe(
      (res) => {
        this.forms.reset();
        this._router.navigate(["/sign-in"]);
      },
      (error) => {
        alert("User Already Exists");
      }
    );
  }
  ngOnDestroy(): void {
    (this.destr_0 as Subscription).unsubscribe();
    (this.destr_1 as Subscription).unsubscribe();
    (this.destr_2 as Subscription).unsubscribe();
    (this.destr_3 as Subscription).unsubscribe();
  }
}
