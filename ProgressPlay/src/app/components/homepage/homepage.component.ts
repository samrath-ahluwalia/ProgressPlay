import { Component, OnInit, HostListener  } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  slideContent: any = [];
  isExtended: boolean = true;
  expandedIndex: number = -1;
  questions: any[] =  [
    { title: 'How do I set up my account?', answer: 'Upon your initial visit to our application, you are afforded the opportunity to establish an account. This process involves the creation of a unique username and password, in addition to providing a valid email address. These credentials are required during the signup phase. Subsequently, access to the application is granted through the login page, where your unique username and password must be entered correctly. This ensures secure and personalized access to your application.' },
    { title: 'How to upload my profile picture?', answer: 'In the profile section of our application, there is an option to upload an image. Upon selecting this option, you are presented with the ability to choose an image in any of the following formats: JPEG, PNG, GIF, among others. This feature allows for a high degree of personalization and flexibility in customizing your profile.' },
    { title: 'How can I manage my dashboard?', answer: 'The dashboard of our application houses your personalized list, which includes the name of the list and all associated tasks. Each task is accompanied by options such as Edit, Delete, and Mark as Done, providing you with comprehensive control over your task management.' },
    { title: 'How do I mark a task as done?', answer: 'Within our application, there exists a feature labeled Create List. This function allows for the generation of a new list. Additionally, a progress indicator is available, which reflects the proportion of tasks that have been marked as Done relative to the total number of active tasks. This feature is exclusively available within the dashboard.' },
    { title: 'How is my score calculated? ', answer: 'Upon selecting the checkbox located in the dashboard, a dialog box will appear, seeking confirmation for marking the task as completed. Should you affirm this action, your score will increase by two points. This score is maintained and associated with your profile. You can view your accumulated points in the Rewards section by selecting the View Scores option. This system encourages and rewards task completion. Your score just gets calculated depending upon how many tasks that you have created are marked as done by you after you finished your task you get a +2 score for every done task' },
    { title: 'How can I claim my rewards?', answer: 'The status of rewards, which currently take the form of badges, is contingent upon your accumulated score. You can view the complete list of available rewards by selecting the My Rewards option. Here, you will find rewards categorized as either Locked or Unlocked. Unlocked rewards are eligible for redemption upon selection, while locked rewards remain inaccessible until the requisite score is achieved. This system ensures that rewards are distributed based on user performance and engagement.' },
  ];
  username: string = "";
  hasScrolled: boolean = false;
  isScrollingEnabled: boolean = false;

  constructor (private _localService: LocalService) { }

  ngOnInit(): void {
    this.slideContent =  [
      { image: "images/car3.png", caption: "", data: "" },
      { image: "images/car2.png", caption: "", data: "" },
      { image: "images/car1.png", caption: "", data: "" }
    ]
    this.username = this._localService.get(Keys.ActiveUsername, false)
  }

  toggleExpansion(index: number){
    if (this.expandedIndex === index) {
      this.expandedIndex = -1;
    } else {
      this.expandedIndex = index;
    }
  }
  
  toggleExtended() {
    this.isExtended = !this.isExtended;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    console.log('Scroll Position:', scrollPosition);
  
    if (!this.isScrollingEnabled) {
      if (scrollPosition < 25) {
        window.scrollTo(0, 0);
      } else {
        this.isScrollingEnabled = true;
  
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
          const welcomeSectionBottom = welcomeSection.getBoundingClientRect().bottom + window.scrollY;
          console.log('Welcome Section Bottom:', welcomeSectionBottom);
  
          window.scrollTo({
            top: welcomeSectionBottom,
            behavior: 'smooth'
          });
  
          // Reset scrolling state after the smooth scroll
          setTimeout(() => {
            this.isScrollingEnabled = true;
            this.hasScrolled = true;
          }, 1000); // Adjust timeout if needed
        }
      }
    } else if (this.hasScrolled) {
      const welcomeSection = document.getElementById('welcomeSection');
      if (welcomeSection) {
        const welcomeSectionTop = welcomeSection.getBoundingClientRect().top + window.scrollY;
        console.log('Welcome Section Top:', welcomeSectionTop);
  
        if (scrollPosition < welcomeSectionTop) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
  
          this.isScrollingEnabled = false;
          this.hasScrolled = false;
        }
      }
    }
  }
  
}
