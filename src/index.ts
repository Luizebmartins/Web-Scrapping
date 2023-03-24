import * as path from 'path';
import AdmZip  from 'adm-zip';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import fs from 'fs';
import { getFileName } from "./utils/file"

const authorizedSharesURL =
  'https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/consultas/mercado-a-vista/opcoes/series-autorizadas/';

const outputZipFolder = path.resolve(__dirname, '..', 'output/zip');
const outputCsvFolder = path.resolve(__dirname, '..', 'output/csv');

axios
    .get(authorizedSharesURL)
    .then((axiosResponse) => {
        const html = axiosResponse.data;
        const { window } = new JSDOM(html);
        const { document } = window;
        const primaryTextElements: Element[] = [...document.getElementsByClassName('primary-text')];
        const authorizedSharesText: Element = primaryTextElements[0];
        const linkA = authorizedSharesText.querySelector('a');
        const linkHref = linkA.getAttribute('href');
        const linkDowload = `https://www.b3.com.br${linkHref}`;

        axios({
            method: 'get',
            url: linkDowload,
            responseType: 'stream',
        })
        .then(async (response) => {
            const fileName = getFileName(linkHref)
            const outputZipFilePath = path.resolve(outputZipFolder, `${fileName}.zip`);
            const outputStream = fs.createWriteStream(outputZipFilePath);
            response.data.pipe(outputStream)

            outputStream.on('finish', () => {
                console.log(`Arquivo zip salvo em: ${outputZipFilePath}`);
                const zip = new AdmZip(outputZipFilePath)
                const zipEntries = zip.getEntries()
                zipEntries.forEach((zipEntry) => {
                    const csvContent = zip.readAsText(zipEntry); 
                    const outputCsvFilePath = path.resolve(outputCsvFolder, `${fileName}.csv`);
                    
                    fs.writeFileSync(outputCsvFilePath, csvContent); 
                });
     
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });
