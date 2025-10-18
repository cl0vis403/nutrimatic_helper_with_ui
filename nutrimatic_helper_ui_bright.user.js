// ==UserScript==
// @name        Nutrimatic Helper
// @namespace   http://tampermonkey.net/
// @version     4.3
// @description Nutrimatic Helper with Dark Theme and DuckDuckGo-style Search
// @author      KoolShow | Northsea_403
// @match       https://nutrimatic.org/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏所有原始元素 */
        body > *:not(#nutrimatic-custom-container):not(style):not(script) {
            display: none !important;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            max-width: 100%;
            margin: 0;
            padding: 40px 20px 20px 20px;
            background: linear-gradient(135deg, #f5f8fa 0%, #e8f0f7 50%, #f0f5f9 100%);
            background-attachment: fixed;
            color: #2c3e50;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            overflow-x: hidden;
        }

        /* 背景渐变光晕 */
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle 900px at 30% 20%, rgba(90, 159, 212, 0.4) 0%, transparent 50%),
                        radial-gradient(circle 1600px at 70% 60%, rgba(160, 255, 250, 0.5) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        #nutrimatic-custom-container {
            width: 100%;
            max-width: 650px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .title {
            font-size: 3.5em;
            font-weight: bold;
            font-family: Times, "Times New Roman", serif;
            background: linear-gradient(135deg, #2c5f8d 0%, #1a7a9e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-decoration: none;
            margin-bottom: 20px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
        }

        .title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #5a9fd4, transparent);
            transition: width 0.3s ease;
        }

        .title:hover::after {
            width: 100%;
        }

        .title:hover {
            transform: translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(44, 95, 141, 0.2)) brightness(1.1);
        }

        .subtitle {
            font-size: 1em;
            font-style: italic;
            color: #5a6c7d;
            margin-bottom: 30px;
            width: 100%;
            text-align: left;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        #custom-form {
            background: transparent;
            padding: 0;
            margin-bottom: 30px;
            border: none;
            width: 100%;
            position: relative;
        }

        /* 搜索框 */
        .search-wrapper {
            display: flex;
            position: relative;
            width: 100%;
            align-items: center;
            background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
            border-radius: 26px;
            overflow: hidden;
            height: 52px;
            border: 2px solid #d1dce5;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08),
                        0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .search-wrapper::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
            border-radius: 26px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        .search-wrapper:focus-within {
            border-color: (135deg, #ffffff 0%, #f0f8ff 100%);
            box-shadow: 0 2px 12px rgba(90, 159, 212, 0.15),
                        0 4px 20px rgba(90, 159, 212, 0.1);
        }

        .search-wrapper:focus-within::before {
            opacity: 0.1;
        }

        #custom-form input[type="text"] {
            flex: 1;
            padding: 0 60px 0 24px !important;
            font-size: 18px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            border: none !important;
            background: transparent !important;
            color: #2c3e50 !important;
            height: 52px !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
            outline: none !important;
            line-height: 52px !important;
        }

        #custom-form input[type="text"]:focus {
            outline: none !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
            border: none !important;
        }

        #custom-form input[type="text"]::placeholder {
            color: #8899aa;
        }

        #custom-form input[type="text"]::-webkit-search-cancel-button,
        #custom-form input[type="text"]::-webkit-search-decoration {
            -webkit-appearance: none;
            appearance: none;
            display: none !important;
        }

        #custom-form input[type="text"]::-ms-clear {
            display: none !important;
        }

        .search-button {
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(90, 159, 212, 0.1), rgba(85, 201, 160, 0.1));
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            padding: 0;
        }

        .search-button:hover {
            background: linear-gradient(135deg, rgba(90, 159, 212, 0.2), rgba(85, 201, 160, 0.15));
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 2px 8px rgba(90, 159, 212, 0.2);
        }

        .search-button:active {
            transform: translateY(-50%) scale(0.98);
        }

        .search-button svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: #5a9fd4;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        #top-pagination {
            display: none !important;
        }

        #bottom-pagination {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 0;
            background: transparent;
            border-radius: 0;
            margin: 20px 0;
            border: none;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        #bottom-pagination:empty {
            display: none;
        }

        .pagination-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .page-button {
            min-width: 35px;
            width: 35px;
            height: 44px;
            padding: 0;
            background: #ffffff;
            color: #2c3e50;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d1dce5;
            position: relative;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .page-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(90, 159, 212, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .page-button:hover::before {
            left: 100%;
        }

        .page-button:hover {
            background: #f8fbfd;
            border-color: #5a9fd4;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(90, 159, 212, 0.15);
        }

        .page-button.current {
            background: linear-gradient(135deg, #5a9fd4 0%, #4a8fc4 100%);
            color: #ffffff;
            border-color: #5a9fd4;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(90, 159, 212, 0.3);
        }

        .page-button.current:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(90, 159, 212, 0.4);
        }

        .page-button.dots {
            background: transparent;
            border: none;
            box-shadow: none;
            cursor: default;
            pointer-events: none;
        }

        .page-button.arrow {
            font-size: 20px;
        }

        .results-per-page {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #5a6c7d;
            font-size: 14px;
        }

        .results-per-page select {
            padding: 6px 12px;
            background: #ffffff;
            color: #2c3e50;
            border: 1px solid #d1dce5;
            border-radius: 8px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .results-per-page select:hover {
            background: #f8fbfd;
            border-color: #5a9fd4;
        }

        .results-per-page select:focus {
            border-color: #5a9fd4;
            box-shadow: 0 0 0 3px rgba(90, 159, 212, 0.1);
        }

        #content-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        #content-wrapper > * {
            color: #2c3e50;
        }

        #content-wrapper h2, #content-wrapper h3 {
            color: #1a2332;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        #content-wrapper ul {
            padding-left: 20px;
        }

        #content-wrapper a {
            color: #5a9fd4;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        #content-wrapper a:hover {
            color: #4a8fc4;
            text-decoration: underline;
        }

        .nutrimatic-results-list {
            list-style: none;
            padding: 0;
            margin: 0;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #d1dce5;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08),
                        0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .nutrimatic-result-item {
            padding: 14px 18px;
            border-bottom: 1px solid #e8f0f7;
            display: flex;
            align-items: center;
            gap: 30px;
            font-size: 1.25em;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .nutrimatic-result-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, #5a9fd4, #55c9a0);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }

        .nutrimatic-result-item:last-child {
            border-bottom: none;
        }

        .nutrimatic-result-item:hover {
            background: linear-gradient(90deg, rgba(90, 159, 212, 0.05) 0%, transparent 100%);
            padding-left: 24px;
        }

        .nutrimatic-result-item:hover::before {
            transform: scaleY(1);
        }

        /* 词频数字效果 */
        .nutrimatic-weight-display {
            font-weight: 700;
            min-width: 65px;
            text-align: left;
            font-size: 1em;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
        }

        .nutrimatic-result-item:hover .nutrimatic-weight-display {
            transform: scale(1.05);
        }

        #content-wrapper.loading {
            opacity: 0.5;
            pointer-events: none;
        }

        #content-wrapper.loading::after {
            content: "Loading...";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            background: linear-gradient(135deg, #5a9fd4, #55c9a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: #f5f8fa;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #b0c4d4, #c0d4e4);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #9ab4c4, #aac4d4);
        }
    `;
document.head.appendChild(style);

    // 获取原始表单和搜索值
    const originalForm = document.querySelector('form');
    const originalInput = originalForm ? originalForm.querySelector('input[name="q"]') : null;
    const initialSearchValue = originalInput ? originalInput.value : '';

    // 创建自定义容器
    const customContainer = document.createElement('div');
    customContainer.id = 'nutrimatic-custom-container';

    // 创建标题
    const titleElement = document.createElement('a');
    titleElement.href = 'https://nutrimatic.org/2024';
    titleElement.classList.add('title');
    titleElement.textContent = "Nutrimatic";
    customContainer.appendChild(titleElement);

    // 创建副标题
    const subtitleElement = document.createElement('div');
    subtitleElement.classList.add('subtitle');
    subtitleElement.textContent = "Almost, but not quite, entirely unlike tea.";
    customContainer.appendChild(subtitleElement);

    // 创建自定义表单
    const customForm = document.createElement('form');
    customForm.id = 'custom-form';

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.name = 'q';
    searchInput.value = initialSearchValue;
    searchInput.placeholder = 'Search patterns...';
    searchInput.autocomplete = 'off';

    const searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.type = 'button';
    searchButton.innerHTML = `
        <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
    `;

    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(searchButton);
    customForm.appendChild(searchWrapper);
    customContainer.appendChild(customForm);

    // 创建分页容器
    const topPaginationContainer = document.createElement('div');
    topPaginationContainer.id = 'top-pagination';
    customContainer.appendChild(topPaginationContainer);

    // 创建内容容器
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'content-wrapper';
    customContainer.appendChild(contentWrapper);

    // 创建底部分页容器
    const bottomPaginationContainer = document.createElement('div');
    bottomPaginationContainer.id = 'bottom-pagination';
    customContainer.appendChild(bottomPaginationContainer);

    // 清空body并添加自定义容器
    document.body.appendChild(customContainer);

    // 搜索按钮点击事件
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        customForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // 强制输入框样式
    function forceInputStyle() {
        searchInput.style.setProperty('background', 'transparent', 'important');
        searchInput.style.setProperty('color', '#2c3e50', 'important');
        searchInput.style.setProperty('border', 'none', 'important');
        searchInput.style.setProperty('box-shadow', 'none', 'important');
        searchInput.style.setProperty('-webkit-box-shadow', 'none', 'important');
        searchInput.style.setProperty('outline', 'none', 'important');
    }

    forceInputStyle();

    ['focus', 'blur', 'change', 'input', 'click'].forEach(eventType => {
        searchInput.addEventListener(eventType, forceInputStyle);
    });

    const observer = new MutationObserver(forceInputStyle);
    observer.observe(searchInput, {
        attributes: true,
        attributeFilter: ['style']
    });

    function updatePaginationControls(container, queryParams, isTop = false) {
        if (isTop) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = '';

        const currentStart = parseInt(queryParams.get('start') || '0', 10);
        const currentNum = parseInt(queryParams.get('num') || '40', 10);
        const currentPage = Math.floor(currentStart / currentNum) + 1;
        const baseUrl = `${window.location.origin}${window.location.pathname}`;

        // 检查当前页面是否有结果来判断是否还有下一页
        const hasResults = document.querySelectorAll('.nutrimatic-result-item').length > 0;
        const isLastPage = !hasResults || document.querySelectorAll('.nutrimatic-result-item').length < currentNum;

        // 创建翻页控件容器
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';

        // 上一页按钮
        const prevButton = document.createElement('a');
        prevButton.className = 'page-button arrow';
        prevButton.textContent = '<';
        if (currentStart > 0) {
            const prevStart = Math.max(0, currentStart - currentNum);
            const prevParams = new URLSearchParams(queryParams);
            prevParams.set('start', prevStart.toString());
            prevParams.set('num', currentNum.toString());
            prevButton.href = `${baseUrl}?${prevParams.toString()}`;
        } else {
            prevButton.style.opacity = '0.3';
            prevButton.style.pointerEvents = 'none';
        }
        paginationControls.appendChild(prevButton);

        // 计算要显示的页码（显示当前页前后各2页）
        const pagesToShow = [];

        // 始终显示第1页
        if (currentPage > 2) {
            pagesToShow.push(1);
            if (currentPage > 3) {
                pagesToShow.push('...');
            }
        }

        // 显示当前页附近的页码
        const startPage = Math.max(1, currentPage - 2);
        const endPage = currentPage + 2;

        for (let i = startPage; i <= endPage; i++) {
            if (!pagesToShow.includes(i)) {
                pagesToShow.push(i);
            }
        }

        // 如果不是最后一页，显示省略号和下一页提示
        if (!isLastPage) {
            if (currentPage < endPage - 1) {
                pagesToShow.push('...');
            }
        }

        // 创建页码按钮
        pagesToShow.forEach(page => {
            const pageButton = document.createElement('a');
            pageButton.className = 'page-button';

            if (page === '...') {
                pageButton.classList.add('dots');
                pageButton.textContent = '...';
            } else {
                pageButton.textContent = page;
                const pageStart = (page - 1) * currentNum;
                const pageParams = new URLSearchParams(queryParams);
                pageParams.set('start', pageStart.toString());
                pageParams.set('num', currentNum.toString());
                pageButton.href = `${baseUrl}?${pageParams.toString()}`;

                if (page === currentPage) {
                    pageButton.classList.add('current');
                }
            }

            paginationControls.appendChild(pageButton);
        });

        // 下一页按钮
        const nextButton = document.createElement('a');
        nextButton.className = 'page-button arrow';
        nextButton.textContent = '>';
        if (!isLastPage) {
            const nextStart = currentStart + currentNum;
            const nextParams = new URLSearchParams(queryParams);
            nextParams.set('start', nextStart.toString());
            nextParams.set('num', currentNum.toString());
            nextButton.href = `${baseUrl}?${nextParams.toString()}`;
        } else {
            nextButton.style.opacity = '0.3';
            nextButton.style.pointerEvents = 'none';
        }
        paginationControls.appendChild(nextButton);

        container.appendChild(paginationControls);

        // 创建每页结果数选择器
        const resultsPerPage = document.createElement('div');
        resultsPerPage.className = 'results-per-page';

        const label = document.createElement('span');
        label.textContent = 'Results per page:';
        resultsPerPage.appendChild(label);

        const select = document.createElement('select');
        [20, 40, 60, 80, 100].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            if (num === currentNum) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            const newParams = new URLSearchParams(queryParams);
            newParams.set('num', this.value);
            newParams.set('start', '0');
            const newUrl = `${baseUrl}?${newParams.toString()}`;
            fetchAndUpdate(newUrl);
        });

        resultsPerPage.appendChild(select);
        container.appendChild(resultsPerPage);
    }

    function getWeightColor(weight) {
        if (weight >= 5) return '#55EEA0';
        if (weight >= 4) {
            const t = weight - 4;
            return interpolateColor('#88DD33', '#55EEA0', t);
        }
        if (weight >= 3) {
            const t = weight - 3;
            return interpolateColor('#bbcc55', '#88DD33', t);
        }
        if (weight >= 2) {
            const t = weight - 2;
            return interpolateColor('#eecc44', '#bbcc55', t);
        }
        if (weight >= 1) {
            const t = weight - 1;
            return interpolateColor('#eebb88', '#eecc44', t);
        }
        if (weight >= 0) {
            const t = weight;
            return interpolateColor('#ee9999', '#eebb88', t);
        }
        return '#99dd22';
    }

    function interpolateColor(color1, color2, t) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);

        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function extractCleanContent(doc) {
        const clone = doc.body.cloneNode(true);

        const titles = clone.querySelectorAll('a[href*="nutrimatic.org"]');
        titles.forEach(title => {
            if (title.textContent.includes('Nutrimatic')) {
                title.remove();
            }
        });

        const forms = clone.querySelectorAll('form');
        forms.forEach(form => form.remove());

        const searchInputs = clone.querySelectorAll('input[name="q"]');
        searchInputs.forEach(input => input.remove());

        // 删除包含 "Almost, but not quite" 的段落
        const paragraphs = clone.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.textContent.includes('Almost, but not quite, entirely unlike tea')) {
                p.remove();
            }
        });

        return clone.innerHTML;
    }

    async function renderSearchResultsAndPagination(doc, currentQueryParams) {
        const searchQuery = currentQueryParams.get('q');
        const isSearchPage = searchQuery !== null && searchQuery.trim() !== '';

        const newSearchInput = doc.querySelector('input[name="q"]');
        if (newSearchInput) {
            searchInput.value = newSearchInput.value;
        } else {
            searchInput.value = '';
        }

        const newDocResults = doc.querySelectorAll('span[style*="font-size"]');
        const hasResults = newDocResults.length > 0;

        if (isSearchPage && hasResults) {
            contentWrapper.innerHTML = '';

            const resultsList = document.createElement('ul');
            resultsList.className = 'nutrimatic-results-list';

            newDocResults.forEach(spanElement => {
                const li = document.createElement('li');
                li.className = 'nutrimatic-result-item';

                const word = spanElement.textContent.trim();
                const fontSizeMatch = spanElement.style.fontSize.match(/(\d+(\.\d+)?)em/);
                const weight = fontSizeMatch ? parseFloat(fontSizeMatch[1]) : null;

                const weightSpan = document.createElement('span');
                weightSpan.className = 'nutrimatic-weight-display';
                weightSpan.textContent = weight !== null ? weight.toFixed(3) : '';
                weightSpan.style.color = getWeightColor(weight);

                li.appendChild(weightSpan);
                li.appendChild(document.createTextNode(word));
                li.dataset.weight = weight;

                resultsList.appendChild(li);
            });

            contentWrapper.appendChild(resultsList);

            // 在结果渲染完成后更新分页
            updatePaginationControls(topPaginationContainer, currentQueryParams, true);
            updatePaginationControls(bottomPaginationContainer, currentQueryParams, false);

        } else {
            contentWrapper.innerHTML = extractCleanContent(doc);
            topPaginationContainer.innerHTML = '';
            bottomPaginationContainer.innerHTML = '';
        }
    }

    async function fetchAndUpdate(url, isPopState = false) {
        const urlObj = new URL(url);
        const queryParams = urlObj.searchParams;

        contentWrapper.classList.add('loading');

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlText = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(htmlText, 'text/html');

            document.title = newDoc.title;

            if (!isPopState) {
                history.pushState({}, newDoc.title, url);
            }

            await renderSearchResultsAndPagination(newDoc, queryParams);

        } catch (error) {
            console.error('Nutrimatic Helper: Failed to fetch:', error);
            contentWrapper.textContent = "Error loading content. Please try again.";
        } finally {
            contentWrapper.classList.remove('loading');
        }
    }

    customForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(customForm);
        const searchParams = new URLSearchParams(formData);

        const urlParams = new URLSearchParams(window.location.search);
        searchParams.set('num', urlParams.get('num') || '40');
        searchParams.set('start', '0');

        const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
        fetchAndUpdate(newUrl);
    });

    document.body.addEventListener('click', function(event) {
        const targetLink = event.target.closest("a.page-button");

        if (targetLink && targetLink.href && targetLink.href.startsWith(window.location.origin + window.location.pathname)) {
            event.preventDefault();
            fetchAndUpdate(targetLink.href);
        }
    });

    window.addEventListener('popstate', () => {
        fetchAndUpdate(window.location.href, true);
    });

    renderSearchResultsAndPagination(document, new URLSearchParams(window.location.search));

})();
