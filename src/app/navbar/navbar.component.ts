import { ToastrService } from 'ngx-toastr';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  notice :any
constructor(private DataService:DataService,
      private toastr: ToastrService
){}
ngOnInit(): void {
 this.DataService.getNotice().subscribe((notice)=>{
  console.log(notice);

  this.notice =notice
 })
}
restNotice(){
  this.DataService.updateNotice(0)
  this.notice=0
  this.toastr.info(
    'all items removed form Cart list',
    'Cart',
    {
      positionClass: 'toast-top-center',
    }
  );
}
}
