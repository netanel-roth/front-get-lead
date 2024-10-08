import React from 'react';

export const FormatTypes = {
  ARRAY: 'array',
  CSV: 'csv',
  JSON: 'json',
  HTML: 'html',
  PHP: 'php',
  SERIALIZED: 'serialized',
  XML: 'xml',
} as const;

type FormatType = typeof FormatTypes[keyof typeof FormatTypes];

export const factory = (data: any, fromType: FormatType | null = null) => {
  return new Format(data, fromType);
};

class Format {
  private _data: any;

  constructor(data: any = null, fromType: FormatType | null = null) {
    this._data = data;

    // יצירת מפת מפתחות לפונקציות ההמרה
    const formatFunctions: Record<string, (data: string) => any> = {
      json: this._from_json,
      xml: this._from_xml,
      csv: this._from_csv,
    };

    if (fromType !== null && formatFunctions[fromType]) {
      this._data = formatFunctions[fromType](data);
    }
  }

  toArray(data: any = null): any[] {
    if (data === null) {
      data = this._data;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((item: any) => {
      return typeof item === 'object' ? this.toArray(item) : item;
    });
  }

  toXml(data: any = null, basenode = 'xml'): string {
    if (data === null) {
      data = this._data;
    }

    let xml = new DOMParser().parseFromString(`<${basenode}></${basenode}>`, 'text/xml');
    const createXmlNode = (nodeData: any, parent: Element, nodeName: string) => {
      const node = xml.createElement(nodeName);
      if (typeof nodeData === 'object' && !Array.isArray(nodeData)) {
        Object.keys(nodeData).forEach(key => {
          createXmlNode(nodeData[key], node, key);
        });
      } else {
        node.textContent = nodeData;
      }
      parent.appendChild(node);
    };

    Object.keys(data).forEach(key => createXmlNode(data[key], xml.documentElement, key));

    return new XMLSerializer().serializeToString(xml);
  }

  toJson(data: any = null): string {
    if (data === null) {
      data = this._data;
    }
    return JSON.stringify(data);
  }

  toCsv(data: any = null, delimiter = ',', enclosure = '"'): string {
    if (data === null) {
      data = this._data;
    }

    let csv = '';
    if (Array.isArray(data)) {
      const keys = Object.keys(data[0]);
      csv += keys.join(delimiter) + '\n';

      data.forEach((item: any) => {
        keys.forEach((key, index) => {
          if (index > 0) csv += delimiter;
          csv += `${enclosure}${item[key]}${enclosure}`;
        });
        csv += '\n';
      });
    }
    return csv;
  }

  private _from_json(data: string) {
    return JSON.parse(data);
  }

  private _from_xml(data: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    return xmlDoc;
  }

  private _from_csv(data: string, delimiter = ',', enclosure = '"') {
    const lines = data.split('\n');
    const keys = lines[0].split(delimiter);
    return lines.slice(1).map(line => {
      const values = line.split(delimiter);
      const obj: any = {};
      keys.forEach((key, index) => {
        obj[key] = values[index].replace(new RegExp(`^${enclosure}|${enclosure}$`, 'g'), '');
      });
      return obj;
    });
  }
}

// דוגמה לשימוש
const ExampleComponent: React.FC = () => {
  const data = { name: 'John', age: 30 };

  const jsonFormat = factory(data, FormatTypes.JSON).toJson();
  const csvFormat = factory(data, FormatTypes.CSV).toCsv();

  return (
    <div>
      <h1>Formatted Data</h1>
      <p><strong>JSON:</strong></p>
      <pre>{jsonFormat}</pre>

      <p><strong>CSV:</strong></p>
      <pre>{csvFormat}</pre>
    </div>
  );
};

export default ExampleComponent;
