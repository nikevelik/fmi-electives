// document.getElementById('dataForm').addEventListener('submit', function (event) {
//     event.preventDefault();

//     const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
//     const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);

//     const specialties = selectedValues.filter(value => ['i', 'ad', 'is', 'kn', 'm', 'pm', 'mi', 'stat'].includes(value));
//     const columns = selectedValues.filter(value => ['kathedra', 'horarium', 'krediti', 'Disciplina', 'DisciplinaLink', 'Prepodavatel'].includes(value));

//     console.log('Selected Specialties:', specialties);
//     console.log('Selected Columns:', columns);
//     document.getElementById("table-container").innerHTML = "";
//     main(specialties, columns);

// });


async function loadTableHTML(HTMLTableFilePath) {
    const response = await fetch(HTMLTableFilePath);
    return await response.text();
}

function tableHTMLtoJSON(tableHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHTML, 'text/html');
    const table = doc.querySelector('.table');
    const rows = table.querySelectorAll('tbody tr');
    const data = [];

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;

        const cells = row.querySelectorAll('td');
        const rowData = {
            kathedra: cells[0].textContent.trim(),
            disciplina: cells[1].querySelector('a') ? cells[1].querySelector('a').textContent.trim() : cells[1].textContent.trim(),
            disciplinaLink: cells[1].querySelector('a') ? cells[1].querySelector('a').href : '',
            horarium: cells[2].textContent.trim(),
            krediti: cells[3].textContent.trim(),
            grupaID: cells[4].textContent.trim(),
            ad: cells[5].textContent.trim(),
            i: cells[6].textContent.trim(),
            is: cells[7].textContent.trim(),
            kn: cells[8].textContent.trim(),
            m: cells[9].textContent.trim(),
            mi: cells[10].textContent.trim(),
            pm: cells[11].textContent.trim(),
            si: cells[12].textContent.trim(),
            stat: cells[13].textContent.trim(),
            prepodavatel: cells[14].textContent.trim()
        };

        data.push(rowData);
    });

    return data;
}

function filterSpecialnost(d, keys) {
    const keysToExclude = new Set(['i', 'ad', 'is', 'kn', 'm', 'pm', 'mi', 'stat', 'si']);

    return d
        .filter(row => keys.some(key => row[key] !== ""))
        .map(row => {
            const result = Object.fromEntries(
                keys
                    .filter(key => row[key] !== "")
                    .map(key => [key, row[key]])
            );

            Object.entries(row).forEach(([k, v]) => {
                if (!keysToExclude.has(k) && !keys.includes(k) && v !== "") {
                    result[k] = v;
                }
            });

            return result;
        });
}

function groupByGrupaID(arr) {
    return arr.reduce((acc, obj) => {
        const { grupaID, ...rest } = obj;
        if (!acc[grupaID]) {
            acc[grupaID] = [];
        }
        acc[grupaID].push(rest);
        return acc;
    }, {});
}

function removeKeys(arr, keysToRemove) {
    return arr.map(obj => Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))));
}


function createTable(data) {
    data = groupByGrupaID(data);
    removed = ["М", "ПМ", "ПМСтат", "С", "ПМ/ Стат", "ПМ / Ст", "ПМ/Стат", "М", "M", "КП"];
    included = ["ЯКН", "ОКН"]
    const okd = Object.keys(data);
    for (let i = 0; i < okd.length; i++) {
        // if (removed.includes(okd[i])) {
        //     continue;
        // }
//                if (!included.includes(okd[i])) {
//                   continue;
//             }
        const table = document.createElement('table');
        table.border = '1';

        const headerRow = table.insertRow();
        const keys = Object.keys(data[okd[i]][0]);

        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            headerRow.appendChild(th);
        });

        data[okd[i]].forEach(item => {
            const row = table.insertRow();
            keys.forEach(key => {
                const cell = row.insertCell();
                if (key === 'disciplinaLink') {
                    const link = document.createElement('a');
                    link.href = item[key];
                    link.textContent = item['disciplina'];
                    cell.appendChild(link);
                } else {
                    cell.textContent = item[key];
                }
            });
          const checkbox = row.insertCell();
          checkbox.innerHTML = `<input type="checkbox">`;

        });

        const h1 = document.createElement('h1');
        h1.textContent = okd[i];
        console.log(`--${okd[i]}--`);
        document.getElementById('table-container').append(h1);
        document.getElementById('table-container').appendChild(table);
    }
}


async function main(specialties, columns) {
    const tableHTML = await loadTableHTML('/sources/Zimen2024-2025.html');
    const data = tableHTMLtoJSON(tableHTML);
    const cleaned = removeKeys(data, columns);
    const filtered = filterSpecialnost(cleaned, specialties);
    createTable(filtered);
}

main(["si"], ["kathedra", "horarium", "krediti"]);    
