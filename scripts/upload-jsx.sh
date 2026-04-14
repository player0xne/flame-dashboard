#!/bin/bash
# 将 JSX 文件转换为可展示的 HTML 并上传
# 用法: ./scripts/upload-jsx.sh <日期> <类型> <JSX文件路径>
#
# 此脚本会将 JSX 内容包裹在一个基础 HTML 模板中
# 如果你的 JSX 文件本身已经是完整的 HTML（带 <html> 标签），直接用 upload.sh

set -e

DATE="$1"
TYPE="$2"
FILE="$3"

if [ -z "$DATE" ] || [ -z "$TYPE" ] || [ -z "$FILE" ]; then
  echo "用法: $0 <日期 YYYY-MM-DD> <类型 moomoo|local|compare> <JSX文件路径>"
  exit 1
fi

if [[ "$TYPE" != "moomoo" && "$TYPE" != "local" && "$TYPE" != "compare" ]]; then
  echo "错误: 类型必须是 moomoo, local, 或 compare"
  exit 1
fi

if ! [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "错误: 日期格式必须是 YYYY-MM-DD"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "错误: 文件不存在: $FILE"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$PROJECT_DIR/public/data/$DATE"

mkdir -p "$TARGET_DIR"

# Check if file already has <html> tag - if so, copy directly
if grep -qi "<html" "$FILE"; then
  cp "$FILE" "$TARGET_DIR/$TYPE.html"
else
  # Wrap JSX content in HTML template
  cat > "$TARGET_DIR/$TYPE.html" <<HTMLEOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 16px; background: #fff; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
$(cat "$FILE")

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
HTMLEOF
fi

echo "已上传: $FILE -> public/data/$DATE/$TYPE.html"
