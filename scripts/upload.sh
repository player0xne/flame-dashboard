#!/bin/bash
# 上传分析文件到 flame-dashboard
# 用法: ./scripts/upload.sh <日期> <类型> <文件路径>
# 例如: ./scripts/upload.sh 2026-04-07 moomoo /path/to/analysis.html
#
# 类型: moomoo | local | compare
# 日期格式: YYYY-MM-DD

set -e

DATE="$1"
TYPE="$2"
FILE="$3"

if [ -z "$DATE" ] || [ -z "$TYPE" ] || [ -z "$FILE" ]; then
  echo "用法: $0 <日期 YYYY-MM-DD> <类型 moomoo|local|compare> <HTML文件路径>"
  echo ""
  echo "示例:"
  echo "  $0 2026-04-07 moomoo ./moomoo_analysis.html"
  echo "  $0 2026-04-07 local ./local_analysis.html"
  echo "  $0 2026-04-07 compare ./compare_analysis.html"
  exit 1
fi

# Validate type
if [[ "$TYPE" != "moomoo" && "$TYPE" != "local" && "$TYPE" != "compare" ]]; then
  echo "错误: 类型必须是 moomoo, local, 或 compare"
  exit 1
fi

# Validate date format
if ! [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "错误: 日期格式必须是 YYYY-MM-DD"
  exit 1
fi

# Validate file exists
if [ ! -f "$FILE" ]; then
  echo "错误: 文件不存在: $FILE"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$PROJECT_DIR/public/data/$DATE"

mkdir -p "$TARGET_DIR"
cp "$FILE" "$TARGET_DIR/$TYPE.html"

echo "已上传: $FILE -> public/data/$DATE/$TYPE.html"
echo ""
echo "如需部署到 Vercel，请运行:"
echo "  cd $PROJECT_DIR && git add . && git commit -m 'add $DATE $TYPE analysis' && git push"
