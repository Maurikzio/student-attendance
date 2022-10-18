import { format } from "date-fns";
import { CSVLink} from "react-csv"
import { spanishLocale } from "../../helpers";
import { ReactComponent as ExcelIcon} from "./excel-icon.svg";

const DownloadCSV = ({ data, headers, filename }) => {
  const dateForFile = format(Date.now(), "dd'-'LLLL'-'yyyy ", {locale: spanishLocale});
  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={`${filename}-${dateForFile.trim()}.csv`}
      className="py-2 px-4 inline-flex items-center gap-5 rounded-md border bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span>Descargar</span>
      <ExcelIcon className="w-6 h-6"/>
    </CSVLink>
  )
}

export default DownloadCSV;
