document.addEventListener("DOMContentLoaded", async function(){
    const specialties = (['i', 'ad', 'is', 'kn', 'm', 'pm', 'mi', 'stat', 'si']);
    const columns = ["department", "horarium", "credits"];    
    const tableHTML = await loadTableHTML('/sources/Zimen2024-2025.html');
    console.log(getGroups(tableHTML))
    const data = tableHTMLtoObject(tableHTML);
    const cleaned = removeKeys(data, columns);
    const filtered = filterspecialties(cleaned, specialties);
    createTable(filtered);
});

const getGroups = tableHTML => {
  const parser = new DOMParser();
  return [... new Set(Array.from(parser.parseFromString(tableHTML, 'text/html').querySelector('.table').querySelectorAll('tbody tr')).slice(1).map((row => {
    const cells = row.querySelectorAll('td');
    return cells[4].textContent.trim(); // Extract the group property
})))];
}

const loadTableHTML = async HTMLTableFilePath => {
    const response = await fetch(HTMLTableFilePath);
    return await response.text();
}

const mapRow = row => {
    const cells = row.querySelectorAll('td');
    return {
        department: cells[0].textContent.trim(),
        name: cells[1].querySelector('a') ? cells[1].querySelector('a').textContent.trim() : cells[1].textContent.trim(),
        link: cells[1].querySelector('a') ? cells[1].querySelector('a').href : '',
        horarium: cells[2].textContent.trim(),
        credits: cells[3].textContent.trim(),
        group: cells[4].textContent.trim(),
        ad: cells[5].textContent.trim(),
        i: cells[6].textContent.trim(),
        is: cells[7].textContent.trim(),
        kn: cells[8].textContent.trim(),
        m: cells[9].textContent.trim(),
        mi: cells[10].textContent.trim(),
        pm: cells[11].textContent.trim(),
        si: cells[12].textContent.trim(),
        stat: cells[13].textContent.trim(),
        teacher: cells[14].textContent.trim()
    };
};

const tableHTMLtoObject = tableHTML => {
  const parser = new DOMParser();
  return Array.from(parser.parseFromString(tableHTML, 'text/html').querySelector('.table').querySelectorAll('tbody tr')).slice(1).map(mapRow);
}

function filterspecialties(d, keys) {
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
        const { group, ...rest } = obj;
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(rest);
        return acc;
    }, {});
}

function removeKeys(arr, keysToRemove) {
    return arr.map(obj => Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))));
}


function createTable(data) {
    data = groupByGrupaID(data);
    const okd = Object.keys(data);
    for (let i = 0; i < okd.length; i++) {
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
                if (key === 'link') {
                    const link = document.createElement('a');
                    link.href = item[key];
                    link.textContent = item['name'];
                    cell.appendChild(link);
                } else {
                    cell.textContent = item[key];
                }
            });
        });

        const h1 = document.createElement('h1');
        h1.textContent = okd[i];
        document.getElementById('table-container').append(h1);
        document.getElementById('table-container').appendChild(table);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners to all accordion headers
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default button action

            // Toggle the active class on the clicked header
            this.classList.toggle('active');

            // Get the content div that follows the header
            const content = this.nextElementSibling;

            // Toggle the display of the content
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});

