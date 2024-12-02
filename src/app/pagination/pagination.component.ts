import { DataService } from './../data.service';
import {
  Component,
  Input,
  OnInit,
  DoCheck,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentIndexService } from '../current-index.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewInit, OnDestroy {
  apiLoaded: Boolean = false;
  key: any;
  reloadCarousel = false;
  fev = false;
  cart = false;
  notice = 0;
  // Method to trigger the reload
  triggerReload() {
    this.reloadCarousel = true;
    setTimeout(() => {
      this.reloadCarousel = false;
    }, 0); // This delay ensures that the component is re-rendered
  }
  data: any;
  length = [].length;
  ngOnInit(): void {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

    this.DataService.readJsonFile().subscribe((data) => {
      this.data = data;
      this.length = data.length;
    });
    this.key = this.DataService.getVideoKey();
  }

  currentIndex = 0;
  currentIndexSubscription: Subscription;
  currentLengthSubscription: Subscription;
  constructor(
    private currentIndexService: CurrentIndexService,
    private DataService: DataService,
    private toastr: ToastrService
  ) {
    this.currentIndexSubscription = this.currentIndexService
      .getCurrentIndex()
      .subscribe((index) => {
        this.currentIndex = index;
      });
    this.currentLengthSubscription = this.currentIndexService
      .getCurrentLength()
      .subscribe((legnth) => {
        this.length = legnth;
      });
  }
  updateIndexLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentIndexService.updateCurrentIndex(this.currentIndex);
      this.DataService.updateImages(
        this.data[this.currentIndex].colors[0].images
      );
      this.DataService.updateVideoKey(
        this.data[this.currentIndex].video.split('=')[1]
      );
      this.key = this.data[this.currentIndex].video.split('=')[1];
      console.log(this.DataService.getImages());
      this.triggerReload();
    }
  }
  updateIndexRight() {
    if (this.currentIndex < 2) {
      this.currentIndex++;
      this.currentIndexService.updateCurrentIndex(this.currentIndex);
      this.DataService.updateImages(
        this.data[this.currentIndex].colors[0].images
      );
      this.DataService.updateVideoKey(
        this.data[this.currentIndex].video.split('=')[1]
      );
      this.key = this.data[this.currentIndex].video.split('=')[1];

      console.log(this.DataService.getImages());

      this.triggerReload();
    }
  }

  addToFev() {
    this.fev = !this.fev;
    if (this.fev) {
      this.toastr.success(
        'this item added to favorite list success',
        'Favorite',
        {
          positionClass: 'toast-top-center',
        }
      );
    } else {
      this.toastr.info(
        'this item removed form favorite list success',
        'Favorite',
        {
          positionClass: 'toast-top-center',
        }
      );
    }
  }
  addToCart() {
    this.cart = !this.cart;

      this.toastr.success(
        'this item added to Cart list success',
        'Cart',
        {
          positionClass: 'toast-top-center',
        }
      );

    this.DataService.getNotice().subscribe((notice)=>{
      this.notice = notice
    })
    this.notice++
    this.DataService.updateNotice(this.notice);
    console.log(this.notice);

  }
  ngOnDestroy() {
    this.currentIndexSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {}

}
