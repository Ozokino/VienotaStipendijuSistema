import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipCreateComponent } from './scholarship-create.component';

describe('ScholarshipCreateComponent', () => {
  let component: ScholarshipCreateComponent;
  let fixture: ComponentFixture<ScholarshipCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarshipCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScholarshipCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
