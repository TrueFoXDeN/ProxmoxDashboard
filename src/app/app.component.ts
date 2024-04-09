import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {TreeModule} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, TreeModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})


export class AppComponent {
  constructor() {
    this.expandAll()

  }



  title = 'Proxmox';

  values: TreeNode[] = [{
    key: '0',
    label: 'Compute Server',
    icon: 'pi pi-fw pi-server',
    data: '0',
    // @ts-ignore
    isOnline: true,
    children: [
      {
        key: '0-0',
        label: 'Dev Windows',
        data: '1',
        // @ts-ignore
        isOnline: false,
        icon: 'pi pi-fw pi-desktop',

      },
      {
        key: '0-1',
        label: 'Minecraft Linux',
        data: '2',
        // @ts-ignore
        isOnline: true,
        icon: 'pi pi-fw pi-desktop',

      }
    ]
  }]

  expandAll() {
    this.values.forEach((node) => {
      this.expandRecursive(node, true, 0);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean, iteration: number) {
    if(iteration > 0){
      return
    }
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand, iteration + 1);
      });
    }
  }

  toggleService(data: any){
    console.log(data)
  }
}
