const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/i18n/locales/en.json');
const zhPath = path.join(__dirname, 'src/i18n/locales/zh.json');

function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

function analyzeStructureDifferences() {
  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    
    const enFlat = flattenObject(enData);
    const zhFlat = flattenObject(zhData);
    
    const enKeys = new Set(Object.keys(enFlat));
    const zhKeys = new Set(Object.keys(zhFlat));
    
    const onlyInEn = [...enKeys].filter(key => !zhKeys.has(key));
    const onlyInZh = [...zhKeys].filter(key => !enKeys.has(key));
    const commonKeys = [...enKeys].filter(key => zhKeys.has(key));
    
    const analysis = {
      totalEnKeys: enKeys.size,
      totalZhKeys: zhKeys.size,
      commonKeys: commonKeys.length,
      onlyInEn: onlyInEn.sort(),
      onlyInZh: onlyInZh.sort(),
      structureDifferences: {
        enSections: Object.keys(enData).sort(),
        zhSections: Object.keys(zhData).sort()
      }
    };
    
    console.log('=== 国际化文件结构分析 ===\n');
    console.log(`英文文件总key数: ${analysis.totalEnKeys}`);
    console.log(`中文文件总key数: ${analysis.totalZhKeys}`);
    console.log(`共同key数: ${analysis.commonKeys}`);
    console.log(`\n=== 顶级结构对比 ===`);
    console.log('英文文件顶级结构:', analysis.structureDifferences.enSections);
    console.log('中文文件顶级结构:', analysis.structureDifferences.zhSections);
    
    if (onlyInEn.length > 0) {
      console.log(`\n=== 仅存在于英文文件的key (${onlyInEn.length}个) ===`);
      onlyInEn.forEach(key => console.log(`  - ${key}`));
    }
    
    if (onlyInZh.length > 0) {
      console.log(`\n=== 仅存在于中文文件的key (${onlyInZh.length}个) ===`);
      onlyInZh.forEach(key => console.log(`  - ${key}`));
    }
    
    fs.writeFileSync(
      path.join(__dirname, 'i18n_structure_analysis.json'),
      JSON.stringify(analysis, null, 2)
    );
    
    console.log('\n分析结果已保存到 i18n_structure_analysis.json');
    
    return analysis;
  } catch (error) {
    console.error('分析过程中出错:', error.message);
    return null;
  }
}

if (require.main === module) {
  analyzeStructureDifferences();
}

module.exports = { analyzeStructureDifferences, flattenObject };