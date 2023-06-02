// public with sharing class CH3_SerminarDetailController {
//     @AuraEnabled(cacheable=true)
//     public static List<Serminar__c> getSerminarList(String searchKey, String sortBy, String sortDirection) {
//         List<Serminar__c> serminarList = new List<Serminar__c>();
        
        
//         if (String.isBlank(searchKey)) {
//             return serminarList;
//         } else {
//             String formattedKeyword = '*' + searchKey + '*';

//             List<List<SObject>> searchResults = [FIND :formattedKeyword IN ALL FIELDS RETURNING Serminar__c(Id, Name, Price__c, Start_Date__c WHERE Is_Public__c = 'true')];

//             for (List<SObject> resultList : searchResults) {
//                                 for (SObject obj : resultList) {
//                                     serminarList.add((Serminar__c)obj);
//                                 }
//                             }

//             if (sortBy == 'Price') {
//                 serminarList.sort();
//                 if (sortDirection == 'desc') {
//                     serminarList = reverseList(serminarList);
//                 }
//             } else if (sortBy == 'Start Date') {
//                 serminarList.sort();
//                 if (sortDirection == 'desc') {
//                     serminarList = reverseList(serminarList);
//                 }
//             }

//             return serminarList;
//         }
//     }

//     private static List<Serminar__c> reverseList(List<Serminar__c> inputList) {
//         List<Serminar__c> reversedList = new List<Serminar__c>();
//         for (Integer i = inputList.size() - 1; i >= 0; i--) {
//             reversedList.add(inputList[i]);
//         }
//         return reversedList;
//     }
// }

// new



public with sharing class CH3_SerminarDetailController {
    @AuraEnabled(cacheable=true)
    public static List<Serminar__c> getSerminars(String searchInput) {
        String formattedKeyword = '%' + searchInput + '%';
        Decimal price;
        system.debug(searchInput);
        system.debug(formattedKeyword);
        try {
            price = Decimal.valueOf(searchInput);
        } catch (TypeException e) {
            system.debug(e);
            price = null; 
        }

        Date searchDate;
        try {
            searchDate = Date.valueOf(searchInput);
        } catch (TypeException e) {
            searchDate = null; 
        }

        Integer searchQuantity;
        try {
            searchQuantity = Integer.valueOf(searchInput);
        } catch (TypeException e) {
            searchQuantity = null; 
        }
        
        String query = 'SELECT Id, Name,Image__c, Price__c,Code__c, Start_Date__c,End_Date__c, Quantity__c, Description__c FROM Serminar__c WHERE Is_Public__c = \'True\'';
        system.debug(query);

        List<Serminar__c> serminars = Database.query(query);
        List<Serminar__c> filteredSerminars = new List<Serminar__c>();

        Double epsilon = 0.001;

        for (Serminar__c serminar : serminars) {
            if (serminar.Name != null && serminar.Name.containsIgnoreCase(searchInput)) {
                filteredSerminars.add(serminar);
            } else if (serminar.Code__c != null && serminar.Code__c.containsIgnoreCase(searchInput)) {
                filteredSerminars.add(serminar);
            } else if (serminar.Description__c != null && stripHtmlTags(serminar.Description__c).containsIgnoreCase(searchInput)) {
                filteredSerminars.add(serminar);
            } else if (price != null && serminar.Price__c == price) {
                filteredSerminars.add(serminar);
                System.debug(serminar.Price__c.doubleValue());
            } else if (searchDate != null && serminar.Start_Date__c <= searchDate && serminar.End_Date__c >= searchDate) {
                filteredSerminars.add(serminar);
            } else if (searchQuantity != null && serminar.Quantity__c == searchQuantity) {
                filteredSerminars.add(serminar);
            }
        }

        return filteredSerminars;
    }

    private static String stripHtmlTags(String htmlString) {
        String regex = '<[^>]+>';
        return htmlString.replaceAll(regex, '');
    }
}






























