import { Component } from "@angular/core";
import { Papa } from "ngx-papaparse";
import { MatTableDataSource } from "@angular/material";
import { UserDetail } from "./UserDetail";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Rabo Bank";
  userDetails: UserDetail[] = [];
  displayedColumns: string[] = ["firstName", "surName", "issueCount", "dob"];
  dataSource;

  constructor(private papa: Papa) {}

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      this.papa.parse(csv, {
        skipEmptyLines: false,
        header: false,
        complete: results => {
          for (let i = 1; i < results.data.length; i++) {
            let userDetail = {
              firstName: results.data[i][0],
              surName: results.data[i][1],
              issueCount: results.data[i][2],
              dob: results.data[i][3]
            };
            // console.log(JSON.stringify(userDetail));
            this.userDetails.push(userDetail);
          }
          this.dataSource = new MatTableDataSource(this.userDetails);
          this.dataSource.filterPredicate = function(
            data,
            filter: string
          ): boolean {
            return data.issueCount.toString().includes(filter);
          };
        }
      });
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }
}
