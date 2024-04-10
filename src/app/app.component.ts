import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {TreeModule} from "primeng/tree";
import {MessageService, TreeNode} from "primeng/api";
import {DatePipe, NgClass} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {CookieService} from "ngx-cookie-service";
import {ToastModule} from "primeng/toast";
import {AppService} from "./app.service";
import {ExtendedTreeNode} from "./ExtendedTreeNode";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, TreeModule, NgClass, InputTextModule, FormsModule, InputGroupModule, ToastModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements AfterViewInit {
  token = ''
  lastUpdate : Date = new Date()

  values: ExtendedTreeNode[] = [{
    key: '0',
    label: 'Compute Server',
    icon: 'pi pi-fw pi-server',
    data: 0,
    isOnline: false,
    children: [
      {
        key: '0-0',
        label: 'Dev Windows',
        data: 1,
        isOnline: false,
        icon: 'pi pi-fw pi-desktop',
      },
      {
        key: '0-1',
        label: 'Minecraft Linux',
        data: 2,
        isOnline: false,
        icon: 'pi pi-fw pi-desktop',

      }
    ]
  }]

  constructor(private cookieService: CookieService, private messageService: MessageService, private appService: AppService) {
    this.expandAll()

  }

  ngAfterViewInit(): void {
    if (this.cookieService.get('token') == '') {
      console.log('no token')
      this.messageService.add({severity: 'error', detail: 'No Token available'})
    } else {
      this.messageService.add({severity: 'info', detail: 'Starting poll...'})
      this.appService.getStatus().subscribe({
        next: (res: any) => {
          this.setStatus(res.status)
        }, error: (err: any) => {
          this.messageService.add({severity: 'error', detail: 'Token invalid'})
        }
      })
    }
    this.appService.pollInterval.subscribe({
      next: (res: any) => {
        this.appService.getStatus().subscribe({
          next: (res: any) => {
            this.setStatus(res.status)
          }, error: (err: any) => {
            this.messageService.add({severity: 'error', detail: 'Status poll failed'})
          }
        })
      }
    })
  }


  expandAll() {
    this.values.forEach((node) => {
      this.expandRecursive(node, true, 0);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean, iteration: number) {
    if (iteration > 0) {
      return
    }
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand, iteration + 1);
      });
    }
  }

  toggleService(data: any) {
    switch (data) {
      case 0:
        if (this.values[0].isOnline) {
          this.messageService.add({severity: 'info', detail: 'Shutting down Compute Server'})
          this.appService.toggle(0).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Compute Server shut down'})
              this.values[0].isOnline = false
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Compute Server shut down failed'})
            }
          })
        } else {
          this.messageService.add({severity: 'info', detail: 'Starting up Compute Server'})
          this.appService.toggle(0).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Compute Server started '})
              this.values[0].isOnline = true
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Compute Server startup failed'})
            }
          })
        }
        break
      case 1:
        // @ts-ignore
        if (this.values[0].children[0].isOnline) {
          this.messageService.add({severity: 'info', detail: 'Shutting down Dev Windows'})
          this.appService.toggle(1).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Dev Windows shut down'})
              // @ts-ignore
              this.values[0].children[0].isOnline = false
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Dev Windows shut down failed'})
            }
          })
        } else {
          this.messageService.add({severity: 'info', detail: 'Starting up Dev Windows'})
          this.appService.toggle(1).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Dev Windows started'})
              // @ts-ignore
              this.values[0].children[0].isOnline = true
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Dev Windows startup failed'})
            }
          })
        }
        break
      case 2:
        // @ts-ignore
        if (this.values[0].children[1].isOnline) {
          this.messageService.add({severity: 'info', detail: 'Shutting down Minecraft Linux'})
          this.appService.toggle(2).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Minecraft Linux shut down'})
              // @ts-ignore
              this.values[0].children[1].isOnline = false
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Minecraft Linux shut down failed'})
            }
          })
        } else {
          this.messageService.add({severity: 'info', detail: 'Starting up Minecraft Linux'})
          this.appService.toggle(2).subscribe({
            next: (res: any) => {
              this.messageService.add({severity: 'success', detail: 'Minecraft Linux started'})
              // @ts-ignore
              this.values[0].children[1].isOnline = true
            }, error: (err: any) => {
              this.messageService.add({severity: 'error', detail: 'Minecraft Linux startup failed'})
            }
          })
        }
        break
    }

  }

  setStatus(status: boolean[]) {
    this.values[0].isOnline = status[0]
    // @ts-ignore
    this.values[0].children[0].isOnline = status[1]
    // @ts-ignore
    this.values[0].children[1].isOnline = status[2]

    this.setUpdateTime()
  }

  saveToken() {
    this.cookieService.set('token', this.token, {expires: 1000})
    this.token = ''

    this.appService.getStatus().subscribe({
      next: (res: any) => {
        this.setStatus(res.status)
        this.messageService.add({severity: 'success', detail: 'Token saved'})

      }, error: (err: any) => {
        this.messageService.add({severity: 'error', detail: 'Token invalid'})
      }
    })
  }

  setUpdateTime(){
    this.lastUpdate = new Date()
  }
}
