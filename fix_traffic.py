import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

section_start = content.find('<section class="desktop" data-desktop="1">')
section_end = content.find('<section class="desktop" data-desktop="2">', section_start)
if section_end == -1:
    section_end = len(content)

before = content[:section_start]
section = content[section_start:section_end]
after = content[section_end:]

# 提取行车动态卡片内容
traffic_start = section.find("<!-- 第2行：行车动态 -->")
traffic_end = section.find("<!-- 第3行：环境 + 能耗 + 告警", traffic_start)
if traffic_end == -1:
    traffic_end = section.find('<div class="grid-3"', traffic_start)

if traffic_start == -1 or traffic_end == -1:
    print("Not found")
    exit(1)

traffic_card = section[traffic_start:traffic_end]
# 去掉标题前缀和margin-bottom
traffic_card = traffic_card.replace("<!-- 第2行：行车动态 -->", "<!-- 行车动态 -->")
traffic_card = traffic_card.replace('style="margin-bottom: var(--space-lg);"', '')

# 在客流趋势卡片结束后、grid-2结束前，插入行车动态并关闭flex-col
marker = "</div>\n\n          </div>\n\n          <!-- 第2行：行车动态 -->"
idx = section.find(marker)
if idx == -1:
    print("Marker not found")
    exit(1)

# 新结构：客流趋势结束 + 行车动态 + flex-col关闭 + grid-2关闭
new_section = section[:idx] + "</div>\n\n            " + traffic_card.strip() + "\n          </div>\n\n          <!-- 第2行：行车动态 -->" + section[idx + len(marker):]

# 删除原来的行车动态
traffic_start2 = new_section.find("<!-- 第2行：行车动态 -->")
traffic_end2 = new_section.find("<!-- 第3行：环境 + 能耗 + 告警", traffic_start2)
if traffic_end2 == -1:
    traffic_end2 = new_section.find('<div class="grid-3">', traffic_start2)

if traffic_start2 != -1 and traffic_end2 != -1:
    new_section = new_section[:traffic_start2] + "          <!-- 行车动态已移至右列 -->\n\n          " + new_section[traffic_end2:]

content = before + new_section + after

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
