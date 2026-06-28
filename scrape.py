import urllib.request
import re
import json
from bs4 import BeautifulSoup

url = "https://smae.in/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    members = [
        {"name": "Azeem Mohammed Abdul", "role": "Co-Founder & Operations Manager, CarJoz."},
        {"name": "Srijan Rao Polasani", "role": "Design Engineer, Collins Aerospace"},
        {"name": "Varanasi Venkata Bharadwaj", "role": "Engineer-Chart Industries Inc"},
        {"name": "Ajay Kumar D", "role": "Senior Engineering Analyst, Oceaneering"}
    ]
    
    results = []
    
    for member in members:
        name = member["name"]
        element = soup.find(string=re.compile(name))
        img_url = "NOT FOUND"
        if element:
            parent = element.parent
            for _ in range(5):
                if parent:
                    img = parent.find('img')
                    if img:
                        src = img.get('src')
                        if src:
                            img_url = src if src.startswith('http') else "https://smae.in/" + src.lstrip('/')
                        break
                    parent = parent.parent
        member["image"] = img_url
        results.append(member)
        
    with open("committee.json", "w") as f:
        json.dump(results, f, indent=4)
except Exception as e:
    with open("committee.json", "w") as f:
        json.dump({"error": str(e)}, f)
