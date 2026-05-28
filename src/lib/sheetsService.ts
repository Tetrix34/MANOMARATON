// Google Sheets integration service via Google Apps Script Web App
// This integration posts data directly to your customized Apps Script Web App deployment

// Google Sheets integration service via Google Apps Script Web App
// This integration posts data directly to your customized Apps Script Web App deployment

export const DEFAULT_GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzo-2qD8Gn98pSf_KlHZkZo18iIeRphKmv71iGA_cygke39GDTmFlCrqujRD6tEczI/exec';
export const DEFAULT_SPREADSHEET_ID = '1FyUUrwgXYi_Vv7delDqgQiM-zhoHC9MzPBvE_s7jrY-UD_EDFkEw7AYX';

// Helper to get active configuration from LocalStorage
export const getSheetsConfig = () => {
  let savedUrl = localStorage.getItem('google_sheets_gas_url');
  let savedId = localStorage.getItem('google_sheets_spreadsheet_id') || DEFAULT_SPREADSHEET_ID;

  // Migration logic: If the saved URL is the previous default one, migrate it to the new one automatically
  const oldDefaultUrl = 'https://script.google.com/macros/s/AKfycbzfOgmypoCD3_yETPlr9FMsPrT7yT2VKiLvyqiuzBDkVPZdypNCibydUDN5hEU3SlCf/exec';
  if (!savedUrl || savedUrl === oldDefaultUrl) {
    savedUrl = DEFAULT_GAS_WEB_APP_URL;
    localStorage.setItem('google_sheets_gas_url', DEFAULT_GAS_WEB_APP_URL);
  }

  return { gasUrl: savedUrl, spreadsheetId: savedId };
};

// Helper to update active configuration in LocalStorage
export const saveSheetsConfig = (gasUrl: string, spreadsheetId: string) => {
  localStorage.setItem('google_sheets_gas_url', gasUrl.trim());
  localStorage.setItem('google_sheets_spreadsheet_id', spreadsheetId.trim());
};

interface RegistrationPayload {
  ticketNumber: number;
  id: string;
  fullName: string;
  phone: string;
  createdAt: string;
  checkedIn: boolean;
}

/**
 * Sends a single registration payload to the Google Apps Script Web App URL.
 * Uses a robust, multi-language set of keys to accommodate any variable names.
 */
export const appendRegistrationToSheet = async (
  registration: RegistrationPayload
): Promise<boolean> => {
  try {
    const { gasUrl, spreadsheetId } = getSheetsConfig();

    if (!gasUrl || !gasUrl.startsWith('https://')) {
      console.warn('Google Apps Script URL is not configured or invalid. Data stays local.');
      return false;
    }

    // Format local date for Guatemala
    let formattedDate = '';
    try {
      formattedDate = new Date(registration.createdAt).toLocaleString('es-GT', {
        timeZone: 'America/Guatemala',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      formattedDate = new Date(registration.createdAt).toISOString();
    }

    // Build fully mapped fields so whatever variable naming the Apps Script expects, it works.
    const payload = {
      action: 'add',
      spreadsheetId: spreadsheetId,
      sheetId: spreadsheetId,
      id_sheet: spreadsheetId,
      excelId: spreadsheetId,
      ticketNumber: registration.ticketNumber,
      id: registration.id,
      code: registration.id,
      codigo: registration.id,
      fullName: registration.fullName,
      name: registration.fullName,
      nombre: registration.fullName,
      phone: registration.phone,
      telefono: registration.phone,
      createdAt: formattedDate,
      fecha: formattedDate,
      checkedIn: registration.checkedIn,
      asistencia: registration.checkedIn ? 'ASISTIÓ (Mano en Cama)' : 'PENDIENTE'
    };

    // Send via POST. We employ 'no-cors' mode so browser handles Apps Script redirect smoothly 
    // without running into standard CORS-preflight blocks.
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Since 'no-cors' resolves without reading response details, lack of thrown error represents submission success.
    return true;
  } catch (error) {
    console.error('Error posting registration to Google Apps Script:', error);
    throw error;
  }
};

/**
 * Synchronize multiple registrations sequentially or in batches.
 */
export const syncRegistrationsToSheet = async (
  registrations: RegistrationPayload[]
): Promise<boolean> => {
  if (registrations.length === 0) return true;

  try {
    // We send them individually to ensure each row hits the Apps Script doPost accurately
    const syncPromises = registrations.map(reg => appendRegistrationToSheet(reg));
    await Promise.all(syncPromises);
    return true;
  } catch (error) {
    console.error('Error batch syncing registrations to Google Apps Script:', error);
    throw error;
  }
};
