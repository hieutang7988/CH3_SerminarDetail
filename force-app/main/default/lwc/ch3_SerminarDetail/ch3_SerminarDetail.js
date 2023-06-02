// import { LightningElement, wire, track } from 'lwc';
// import { refreshApex } from '@salesforce/apex';
// import getSerminarList from '@salesforce/apex/CH3_SerminarDetailController.getSerminarList';

// export default class Ch3_SeminarDetail extends LightningElement {
//     @track searchText = '';
//     @track sortBy = 'Name';
//     @track sortDirection = 'asc';
//     @track serminars=[];
//     @track serminarList=[];
//     @track renderedSerminars; 
    
//     sortOptions = [
//         { label: 'Name', value: 'Name' },
//         { label: 'Price', value: 'Price__c' },
//         { label: 'Start Date', value: 'Start_Date__c' }
//     ];

//     sortDirectionOptions = [
//         { label: 'Ascending', value: 'asc' },
//         { label: 'Descending', value: 'desc' }
//     ];

//     handleSearchChange(event) {
//         this.searchText = event.target.value;
//     }

//     handleSortChange(event) {
//         this.sortBy = event.target.value;
       
//     }

//     handleSortDirectionChange(event) {
//         this.sortDirection = event.target.value;
       
//     }

//     handleSearchClick() {
//         this.serminarList = this.serminars;
//     }

//     handleKeyPress(event) {
//         if (event.key === 'Enter') {
          
//         }
//     }

//     @wire(getSerminarList, { searchKey: '$searchText', sortBy: '$sortBy', sortDirection: '$sortDirection' })

//     wiredSerminars({ error, data }) {
//         if (data) {
//             this.serminars = data;
//             this.error = undefined;
//         } else if (error) {
//             this.error = error;
//             this.serminars = undefined;
//         }
//     };

//     getSerminars() {
//         refreshApex(this.wiredSerminarsResult);
//     }


//     tableColumns = [
//         { label: 'Name', fieldName: 'Name', sortable: true },
//         { label: 'Code', fieldName: 'Code__c', sortable: true },
//         { label: 'Description', fieldName: 'Description__c', sortable: true },
//         { label: 'Start Date', fieldName: 'Start_Date__c', sortable: true, type: 'date' },
//         { label: 'End Date', fieldName: 'End_Date__c', sortable: true, type: 'date' },
//         { label: 'Price', fieldName: 'Price__c', sortable: true, type: 'currency' },
//         { label: 'Is Public', fieldName: 'Is_Public__c', sortable: true }
//     ];
// }

//new html

import { LightningElement, track } from 'lwc';
import getSerminars from '@salesforce/apex/CH3_SerminarDetailController.getSerminars';
export default class Ch3_SeminarDetail extends LightningElement {
    @track searchInput = '';
    @track sortBy = 'Name';
    @track sortDirection = 'ASC';
    @track serminars = [];
    @track sortedSerminars = [];

    sortOptions = [
        { label: 'Name', value: 'Name' },
        { label: 'Price', value: 'Price__c' },
        { label: 'Start Date', value: 'Start_Date__c' }
    ];

    sortDirectionOptionAsc = [
        { label: 'ASC', value: 'ASC' },
    ];

    sortDirectionOptionDesc = [
        { label: 'DESC', value: 'DESC' }
    ];

    handleClick() {
        this.searchSerminars();
    }

        handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.searchSerminars();
        }
    }

    handleSearch(event) {
        this.searchInput = event.target.value;
    }

    handleSortBy(event) {
        this.sortBy = event.target.value;
        this.sortSerminars();
    }

    handleSortDirection(event) {
        this.sortDirection = event.target.value;
        this.sortSerminars();
    }

    searchSerminars() {
        getSerminars({ searchInput: this.searchInput })
            .then(result => {
                this.serminars = result;
                this.sortSerminars();
            })
            .catch(error => {
                console.error('Error retrieving serminars: ', error);
            });
    }

    sortSerminars() {
        const field = this.sortBy;
        const direction = this.sortDirection;

        this.sortedSerminars = [...this.serminars].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (field === 'Price__c') {
                if (!aValue) return 1; // Đưa giá trị null về cuối mảng
                if (!bValue) return -1; // Đưa giá trị null về cuối mảng
                
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
                console.log(typeof(aValue));
            } else if (field === 'Start_Date__c' ) {

                if (!aValue) return 1; // Đưa giá trị null về cuối mảng
                if (!bValue) return -1; // Đưa giá trị null về cuối mảng

                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else {
                aValue = (aValue || '').toLowerCase();
                bValue = (bValue || '').toLowerCase();
            }

            if (direction === 'ASC') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
}
































