import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../../interfaces/role';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role-list',
  imports: [MatIconModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css'
})
export class RoleList {

  @Input({required: true}) roles!: Role[] | null;
  
  @Output() deleteRole: EventEmitter<string> = new EventEmitter<string>();


  delete(id: string) {
    this.deleteRole.emit(id);
  }
}
