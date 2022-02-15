import _ from 'lodash';
import XLSX from 'xlsx';

interface Col {
  dataIndex: string;
  title: string;
  children: Col[];
}

const convert2excel = (
  dataSource,
  columns: Col[],
  {
    sheetName,
    fileName,
    getSheetDataSourceItemMeta,
  }: {
    sheetName: string;
    fileName: string;
    getSheetDataSourceItemMeta: (
      cellVal: any,

      
      colDataIndex: string,
      rowIndex: number,
    ) => void | any;
  },
  extendTitle,
  extendDataIndex,
  expandTitle,
) => {
  const colDataIndexs = _.flatten(
    columns
      .map(item => (item.children ? item.children.map(iitem => iitem.dataIndex) : item.dataIndex))
      .concat(extendDataIndex),
  );
  const colTitles = _.flatten(
    columns
      .map(item =>
        item.children
          ? item.children.map(iitem => (expandTitle ? `${item.title}-${iitem.title}` : iitem.title))
          : item.title,
      )
      .concat(extendTitle),
  );

  const sheetDataSource = composeData();

  let sheetDataSourceMeta;

  if (getSheetDataSourceItemMeta) {
    sheetDataSourceMeta = _.flatten(
      sheetDataSource.map((array, rowIndex) =>
        array.map((cellVal, index) => ({
          pos: `${getLetter(index)}${rowIndex + 1}`,
          value: cellVal,
          meta: getSheetDataSourceItemMeta(cellVal, colDataIndexs[index], rowIndex),
        })),
      ),
    );
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetDataSource);

  if (sheetDataSourceMeta) {
    sheetDataSourceMeta
      .filter(item => item && !!item.meta)
      .forEach(item => {
        ws[item.pos] = {
          v: item.value,
          ...item.meta,
        };
      });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* generate XLSX file and send to client */
  XLSX.writeFile(wb, `${fileName}.xlsx`);

  function composeData() {
    return [
      colTitles,
      ...dataSource.map(record => colDataIndexs.map(dataIndex => record[dataIndex])),
    ];
  }

  function getLetter(index) {
    const LETTERS = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    const arrs = [];
    let next = index;
    do {
      const s = Math.floor(next / 26);
      const y = next % 26;
      arrs.unshift(y);
      next = s;
    } while (next !== 0);
    return arrs
      .map((item, iindex) => LETTERS[item - (arrs.length > 1 && iindex === 0 ? 1 : 0)])
      .join('');
  }
};

export { convert2excel };
