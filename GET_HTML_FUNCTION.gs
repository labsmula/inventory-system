// --- VIEW LOADER FUNCTIONS (v1.2.0) ---

// Get HTML content for view (Dashboard, Products, Transactions, Reports, Settings)
function getHtml(view) {
  try {
    let htmlContent = '';
    
    switch(view) {
      case 'dashboard':
        // Return Dashboard.html content
        htmlContent = HtmlService.createHtmlOutputFromFile('Dashboard.html');
        break;
        
      case 'products':
        // Return Products.html content
        htmlContent = HtmlService.createHtmlOutputFromFile('Products.html');
        break;
        
      case 'transactions':
        // Return Transactions.html content
        htmlContent = HtmlService.createHtmlOutputFromFile('Transactions.html');
        break;
        
      case 'reports':
        // Return Reports.html content
        htmlContent = HtmlService.createHtmlOutputFromFile('Reports.html');
        break;
        
      case 'settings':
        // Return Settings.html content
        htmlContent = HtmlService.createHtmlOutputFromFile('Settings.html');
        break;
        
      default:
        // Default to dashboard
        htmlContent = HtmlService.createHtmlOutputFromFile('Dashboard.html');
    }
    
    return htmlContent;
    
  } catch (error) {
    return HtmlService.createHtmlOutput('<h1>Error loading view: ' + error.message + '</h1>');
  }
}

// Alternative: Get HTML content as string (for iframe/dynamic loading)
function getHtmlContent(view) {
  try {
    let htmlString = '';
    
    // Load HTML file content
    switch(view) {
      case 'dashboard':
        htmlString = HtmlService.createHtmlOutputFromFile('Dashboard.html').getContent();
        break;
        
      case 'products':
        htmlString = HtmlService.createHtmlOutputFromFile('Products.html').getContent();
        break;
        
      case 'transactions':
        htmlString = HtmlService.createHtmlOutputFromFile('Transactions.html').getContent();
        break;
        
      case 'reports':
        htmlString = HtmlService.createHtmlOutputFromFile('Reports.html').getContent();
        break;
        
      case 'settings':
        htmlString = HtmlService.createHtmlOutputFromFile('Settings.html').getContent();
        break;
        
      default:
        htmlString = HtmlService.createHtmlOutputFromFile('Dashboard.html').getContent();
    }
    
    // Return as string
    return htmlString;
    
  } catch (error) {
    return '<h1>Error loading view: ' + error.message + '</h1>';
  }
}
