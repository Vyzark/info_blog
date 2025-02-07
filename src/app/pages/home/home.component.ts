import { Component, ViewEncapsulation, inject } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostCard2Component } from '../../components/post-card2/post-card2.component';
import { Post } from '../../interfaces/post.interface';
import { PostService } from '../../services/post.service';
import { DividerModule } from 'primeng/divider';
import { ThemeService } from '../../services/theme.service';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    ButtonModule,
    InputGroupModule,
    PostCardComponent,
    PostCard2Component,
    ReactiveFormsModule,
    FormsModule,
    DividerModule,
    InputTextModule,
    RouterLink,
    DialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  // Injections
  postService = inject(PostService);
  themeService = inject(ThemeService);

  // Simple variables and lists
  // submitted: boolean = false;
  postList: Post[] = [];
  visible: boolean = false;

  // Object proprieties
  //TODO: TEST NEW EMAIL VALIDATOR: /(?<username>[\w\.-]+)@(?<domain>[\w\.-]+)\.(?<tld>[a-zA-Z]{2,6})/
  myForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.pattern(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
    ]),
  });
  Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Methods
  ngOnInit() {
    document.body.classList.add('body-bg');
    this.postList = this.postService.getAll().filter((post) => post.featured);
  }

  ngOnDestroy() {
    document.body.classList.remove('body-bg');
  }

  onSubmit() {
    this.visible = false

    if (
      this.myForm.valid &&
      this.myForm.value.email !== null &&
      this.myForm.value.email !== ''
    ) {
      try {
        // Store subscription info in Local Storage
        localStorage.setItem('subscribedEmail', this.myForm.value.email);
        Swal.fire({
          title: 'Subscribed!',
          text: 'Thank you for your subscription.',
          icon: 'success',
          backdrop: false,
        });
      } catch (error) {
        console.log(error);

        this.Toast.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please, reload the page and try again.',
        });
      }
    }
  }

  showDialog() {
    this.visible = true;
  }
}
