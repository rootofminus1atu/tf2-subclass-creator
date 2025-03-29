import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserWithLoadouts } from '../../interfaces/user';
import { LoadoutService } from '../../services/loadout.service';
// import { User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsyncPipe, MatTableModule, MatIconModule, MatButtonModule, DatePipe, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private usersService = inject(UsersService)
  private loadoutService = inject(LoadoutService)
  users$ = this.usersService.getUsersWithLoadouts()

  displayedColumns: string[] = ['name', 'weapons', 'last updated', 'actions']

  deleteLoadout(id: string) {
    this.loadoutService.deleteLoadout(id).subscribe({
      next: deletionRes => {
        deletionRes.match(
          success => {
            console.log('loadout deleted', success)
            console.log('REFRESHING')
            this.users$ = this.usersService.getUsersWithLoadouts()
            console.log('REFRESHED')
          },
          error => {
            console.error('Error deleting loadout:', error)
          }
        )
      }
    })
  }

  // weaponsString() {
  //   return `${this.lo}`
  // }
}
