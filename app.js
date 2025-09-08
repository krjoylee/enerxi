// 애플리케이션 데이터
const appData = {
  "users": [
    {
      "id": 1,
      "name": "김직원",
      "employeeId": "EMP001",
      "department": "개발팀",
      "role": "employee",
      "healthGoals": {
        "targetWeight": 70,
        "currentWeight": 75,
        "dailyCalories": 2000,
        "dailySugar": 25,
        "dailySodium": 2300
      },
      "preferences": ["저당", "저염"],
      "joinDate": "2024-01-15"
    },
    {
      "id": 2,
      "name": "이관리자",
      "employeeId": "ADM001",
      "department": "인사팀",
      "role": "admin",
      "joinDate": "2023-06-01"
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "그래놀라바",
      "barcode": "8801234567890",
      "calories": 120,
      "sugar": 8,
      "sodium": 95,
      "protein": 3,
      "fat": 4,
      "carbs": 18,
      "price": 1500,
      "stock": 50,
      "category": "건강간식",
      "tags": ["단백질", "저당"]
    },
    {
      "id": 2,
      "name": "아몬드",
      "barcode": "8801234567891",
      "calories": 160,
      "sugar": 1,
      "sodium": 0,
      "protein": 6,
      "fat": 14,
      "carbs": 6,
      "price": 2000,
      "stock": 30,
      "category": "견과류",
      "tags": ["저당", "무염"]
    },
    {
      "id": 3,
      "name": "초콜릿쿠키",
      "barcode": "8801234567892",
      "calories": 200,
      "sugar": 15,
      "sodium": 180,
      "protein": 2,
      "fat": 8,
      "carbs": 32,
      "price": 1200,
      "stock": 80,
      "category": "쿠키",
      "tags": ["고당", "고염"]
    },
    {
      "id": 4,
      "name": "단백질바",
      "barcode": "8801234567893",
      "calories": 180,
      "sugar": 5,
      "sodium": 120,
      "protein": 15,
      "fat": 6,
      "carbs": 20,
      "price": 2500,
      "stock": 25,
      "category": "단백질",
      "tags": ["고단백", "저당"]
    }
  ],
  "inventory": [
    {"productId": 1, "currentStock": 50, "minStock": 20, "lastUpdated": "2024-12-10"},
    {"productId": 2, "currentStock": 30, "minStock": 15, "lastUpdated": "2024-12-10"},
    {"productId": 3, "currentStock": 80, "minStock": 30, "lastUpdated": "2024-12-10"},
    {"productId": 4, "currentStock": 25, "minStock": 10, "lastUpdated": "2024-12-10"}
  ],
  "consumptions": [
    {
      "id": 1,
      "userId": 1,
      "productId": 1,
      "quantity": 1,
      "date": "2024-12-10T09:30:00",
      "calories": 120,
      "sugar": 8,
      "sodium": 95
    },
    {
      "id": 2,
      "userId": 1,
      "productId": 2,
      "quantity": 1,
      "date": "2024-12-10T14:15:00",
      "calories": 160,
      "sugar": 1,
      "sodium": 0
    }
  ],
  "orders": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 100,
      "unitPrice": 1500,
      "totalCost": 150000,
      "orderDate": "2024-12-01",
      "status": "completed",
      "supplier": "헬시스낵"
    },
    {
      "id": 2,
      "productId": 4,
      "quantity": 50,
      "unitPrice": 2500,
      "totalCost": 125000,
      "orderDate": "2024-12-05",
      "status": "pending",
      "supplier": "프로틴플러스"
    }
  ],
  "departmentStats": [
    {
      "department": "개발팀",
      "employeeCount": 12,
      "avgDailyCalories": 1850,
      "avgSugar": 22,
      "avgSodium": 2100,
      "healthScore": 85
    },
    {
      "department": "마케팅팀",
      "employeeCount": 8,
      "avgDailyCalories": 1920,
      "avgSugar": 28,
      "avgSodium": 2250,
      "healthScore": 78
    },
    {
      "department": "인사팀",
      "employeeCount": 5,
      "avgDailyCalories": 1780,
      "avgSugar": 18,
      "avgSodium": 1950,
      "healthScore": 92
    }
  ]
};

// 애플리케이션 상태
let appState = {
  currentUser: null,
  currentRole: null,
  currentView: 'welcome',
  selectedProduct: null,
  chatMessages: [],
  todayConsumptions: []
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
  attachEventListeners();
});

function initializeApp() {
  // 로컬 스토리지에서 데이터 로드
  loadFromLocalStorage();
  
  // 초기 뷰 설정
  showView('welcome');
  
  // 오늘의 소비 데이터 계산
  calculateTodayConsumptions();
}

function attachEventListeners() {
  console.log('Attaching event listeners...');
  
  // 역할 선택 버튼
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      console.log('Role button clicked:', e.currentTarget.dataset.role);
      e.preventDefault();
      e.stopPropagation();
      const role = e.currentTarget.dataset.role;
      selectRole(role);
    });
  });
  
  // 뒤로가기 버튼
  const backToWelcome = document.getElementById('backToWelcome');
  if (backToWelcome) {
    backToWelcome.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Back to welcome clicked');
      showView('welcome');
    });
  }
  
  // 로그인 폼
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      console.log('Login form submitted');
      handleLogin(e);
    });
  }
  
  // 네비게이션
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      console.log('Nav item clicked:', e.target.dataset.view);
      if (e.target.dataset.view) {
        setActiveNavItem(e.target);
        showView(e.target.dataset.view);
      }
    });
  });
  
  // 로그아웃
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Logout clicked');
      logout();
    });
  }
  
  // 액션 버튼들
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Action button clicked:', e.currentTarget.dataset.view);
      if (e.currentTarget.dataset.view) {
        const view = e.currentTarget.dataset.view;
        showView(view);
        const navItem = document.querySelector(`[data-view="${view}"]`);
        if (navItem) setActiveNavItem(navItem);
      }
    });
  });
  
  // 제품 검색
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      searchProduct();
    });
  }
  
  const productSearch = document.getElementById('productSearch');
  if (productSearch) {
    productSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchProduct();
      }
    });
  }
  
  // 섭취 기록
  const recordConsumption = document.getElementById('recordConsumption');
  if (recordConsumption) {
    recordConsumption.addEventListener('click', function(e) {
      e.preventDefault();
      recordConsumption();
    });
  }
  
  // 채팅
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sendMessage();
    });
  }
  
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // 빠른 질문 버튼들
  const quickBtns = document.querySelectorAll('.quick-btn');
  quickBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const question = e.target.dataset.question;
      console.log('Quick question clicked:', question);
      sendQuickMessage(question);
    });
  });
  
  // 모달 관련
  const closeHealthGoals = document.getElementById('closeHealthGoals');
  if (closeHealthGoals) {
    closeHealthGoals.addEventListener('click', closeHealthGoalsModal);
  }
  
  const cancelHealthGoals = document.getElementById('cancelHealthGoals');
  if (cancelHealthGoals) {
    cancelHealthGoals.addEventListener('click', closeHealthGoalsModal);
  }
  
  const healthGoalsForm = document.getElementById('healthGoalsForm');
  if (healthGoalsForm) {
    healthGoalsForm.addEventListener('submit', saveHealthGoals);
  }
}

// 뷰 관리
function showView(viewName) {
  console.log('Showing view:', viewName);
  
  // 모든 뷰 숨기기
  const allViews = document.querySelectorAll('.view');
  allViews.forEach(view => {
    view.classList.remove('active');
  });
  
  // 선택된 뷰 보이기
  const targetView = document.getElementById(viewName + 'View');
  if (targetView) {
    targetView.classList.add('active');
    appState.currentView = viewName;
    
    // 네비게이션 표시/숨기기
    const mainNav = document.getElementById('mainNav');
    if (viewName === 'welcome' || viewName === 'login') {
      mainNav.classList.add('hidden');
    } else {
      mainNav.classList.remove('hidden');
    }
    
    // 뷰별 초기화
    switch(viewName) {
      case 'dashboard':
        updateDashboard();
        break;
      case 'admin':
        updateAdminDashboard();
        break;
      case 'chat':
        initializeChat();
        break;
    }
  }
}

// 역할 선택
function selectRole(role) {
  console.log('Role selected:', role);
  appState.currentRole = role;
  
  // 로그인 화면 설정
  const loginTitle = document.getElementById('loginTitle');
  const employeeOnlyElements = document.querySelectorAll('.employee-only');
  
  if (role === 'admin') {
    loginTitle.textContent = '관리자 로그인';
    employeeOnlyElements.forEach(el => {
      el.style.display = 'none';
    });
  } else {
    loginTitle.textContent = '직원 로그인';
    employeeOnlyElements.forEach(el => {
      el.style.display = 'block';
    });
  }
  
  showView('login');
}

// 로그인 처리
function handleLogin(e) {
  e.preventDefault();
  console.log('Handling login...');
  
  const employeeIdInput = document.getElementById('employeeId');
  const employeeNameInput = document.getElementById('employeeName');
  
  const employeeId = employeeIdInput.value.trim();
  const employeeName = employeeNameInput.value.trim();
  
  console.log('Login attempt:', { employeeId, employeeName, role: appState.currentRole });
  
  // 입력 검증
  if (!employeeId) {
    alert('사원번호를 입력해주세요.');
    return;
  }
  
  if (appState.currentRole === 'employee' && !employeeName) {
    alert('이름을 입력해주세요.');
    return;
  }
  
  // 사용자 검색
  const user = appData.users.find(u => {
    const idMatch = u.employeeId === employeeId;
    const roleMatch = u.role === appState.currentRole;
    const nameMatch = appState.currentRole === 'admin' || u.name === employeeName;
    
    console.log('User check:', { user: u, idMatch, roleMatch, nameMatch });
    return idMatch && roleMatch && nameMatch;
  });
  
  if (user) {
    console.log('Login successful:', user);
    appState.currentUser = user;
    
    // 관리자 메뉴 표시/숨기기
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const scannerNav = document.getElementById('scannerNav');
    
    if (user.role === 'admin') {
      adminOnlyElements.forEach(el => {
        el.style.display = 'block';
      });
      if (scannerNav) scannerNav.style.display = 'none';
    } else {
      adminOnlyElements.forEach(el => {
        el.style.display = 'none';
      });
      if (scannerNav) scannerNav.style.display = 'block';
    }
    
    const targetView = user.role === 'admin' ? 'admin' : 'dashboard';
    showView(targetView);
    
    const navItem = document.querySelector(`[data-view="${targetView}"]`);
    if (navItem) setActiveNavItem(navItem);
    
    // 폼 초기화
    employeeIdInput.value = '';
    employeeNameInput.value = '';
    
  } else {
    console.log('Login failed - user not found');
    alert('로그인 정보가 올바르지 않습니다. 사원번호와 이름을 확인해주세요.');
  }
}

// 로그아웃
function logout() {
  console.log('Logging out...');
  appState.currentUser = null;
  appState.currentRole = null;
  appState.todayConsumptions = [];
  
  // 폼 초기화
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.reset();
  
  // 관리자 메뉴 숨기기
  const adminOnlyElements = document.querySelectorAll('.admin-only');
  const scannerNav = document.getElementById('scannerNav');
  
  adminOnlyElements.forEach(el => {
    el.style.display = 'none';
  });
  if (scannerNav) scannerNav.style.display = 'block';
  
  showView('welcome');
}

// 네비게이션 활성화
function setActiveNavItem(item) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => nav.classList.remove('active'));
  if (item) item.classList.add('active');
}

// 대시보드 업데이트
function updateDashboard() {
  if (!appState.currentUser) return;
  
  console.log('Updating dashboard...');
  
  const user = appState.currentUser;
  const userNameElement = document.getElementById('userName');
  if (userNameElement) userNameElement.textContent = user.name;
  
  // 건강 목표 설정
  if (user.healthGoals) {
    const targetCaloriesElement = document.getElementById('targetCalories');
    const targetSugarElement = document.getElementById('targetSugar');
    const targetSodiumElement = document.getElementById('targetSodium');
    
    if (targetCaloriesElement) targetCaloriesElement.textContent = user.healthGoals.dailyCalories;
    if (targetSugarElement) targetSugarElement.textContent = user.healthGoals.dailySugar;
    if (targetSodiumElement) targetSodiumElement.textContent = user.healthGoals.dailySodium;
  }
  
  // 오늘의 섭취량 계산
  const todayTotals = calculateTodayTotals();
  
  const todayCaloriesElement = document.getElementById('todayCalories');
  const todaySugarElement = document.getElementById('todaySugar');
  const todaySodiumElement = document.getElementById('todaySodium');
  
  if (todayCaloriesElement) todayCaloriesElement.textContent = todayTotals.calories;
  if (todaySugarElement) todaySugarElement.textContent = todayTotals.sugar;
  if (todaySodiumElement) todaySodiumElement.textContent = todayTotals.sodium;
  
  // 진행률 업데이트
  if (user.healthGoals) {
    const caloriePercent = Math.min(100, (todayTotals.calories / user.healthGoals.dailyCalories) * 100);
    const sugarPercent = Math.min(100, (todayTotals.sugar / user.healthGoals.dailySugar) * 100);
    const sodiumPercent = Math.min(100, (todayTotals.sodium / user.healthGoals.dailySodium) * 100);
    
    const calorieProgress = document.getElementById('calorieProgress');
    const sugarProgress = document.getElementById('sugarProgress');
    const sodiumProgress = document.getElementById('sodiumProgress');
    
    if (calorieProgress) calorieProgress.style.width = caloriePercent + '%';
    if (sugarProgress) sugarProgress.style.width = sugarPercent + '%';
    if (sodiumProgress) sodiumProgress.style.width = sodiumPercent + '%';
  }
  
  // 추천 간식 업데이트
  updateRecommendedSnacks();
  
  // 최근 섭취 내역 업데이트
  updateRecentConsumptions();
}

// 오늘의 총 섭취량 계산
function calculateTodayTotals() {
  const today = new Date().toDateString();
  const todayConsumptions = appState.todayConsumptions.filter(c => 
    new Date(c.date).toDateString() === today
  );
  
  return todayConsumptions.reduce((total, consumption) => {
    return {
      calories: total.calories + (consumption.calories || 0),
      sugar: total.sugar + (consumption.sugar || 0),
      sodium: total.sodium + (consumption.sodium || 0)
    };
  }, { calories: 0, sugar: 0, sodium: 0 });
}

// 오늘의 소비 데이터 계산
function calculateTodayConsumptions() {
  const today = new Date().toDateString();
  appState.todayConsumptions = appData.consumptions.filter(c => 
    new Date(c.date).toDateString() === today && 
    c.userId === (appState.currentUser?.id || 1)
  );
}

// 추천 간식 업데이트
function updateRecommendedSnacks() {
  const container = document.getElementById('recommendedSnacks');
  if (!container) return;
  
  // 사용자 선호도에 따른 추천
  const recommendedProducts = appData.products.filter(product => {
    if (!appState.currentUser?.preferences) return true;
    return appState.currentUser.preferences.some(pref => 
      product.tags.includes(pref)
    );
  }).slice(0, 3);
  
  container.innerHTML = recommendedProducts.map(product => `
    <div class="snack-item">
      <div class="snack-info">
        <div class="snack-name">${product.name}</div>
        <div class="snack-calories">${product.calories}kcal</div>
      </div>
    </div>
  `).join('');
}

// 최근 섭취 내역 업데이트
function updateRecentConsumptions() {
  const container = document.getElementById('recentConsumptions');
  if (!container) return;
  
  const recentConsumptions = appState.todayConsumptions
    .map(consumption => {
      const product = appData.products.find(p => p.id === consumption.productId);
      return {
        ...consumption,
        productName: product?.name || '알수없음'
      };
    })
    .slice(-3);
  
  if (recentConsumptions.length === 0) {
    container.innerHTML = '<div class="consumption-item">오늘 아직 섭취 기록이 없습니다.</div>';
    return;
  }
  
  container.innerHTML = recentConsumptions.map(consumption => `
    <div class="consumption-item">
      <div class="consumption-info">
        <div class="consumption-name">${consumption.productName}</div>
        <div class="consumption-time">${formatTime(consumption.date)}</div>
      </div>
    </div>
  `).join('');
}

// 제품 검색
function searchProduct() {
  const productSearch = document.getElementById('productSearch');
  const query = productSearch.value.trim().toLowerCase();
  if (!query) return;
  
  console.log('Searching for product:', query);
  
  const product = appData.products.find(p => 
    p.name.toLowerCase().includes(query) || 
    p.barcode === query
  );
  
  if (product) {
    console.log('Product found:', product);
    appState.selectedProduct = product;
    showProductResult(product);
  } else {
    console.log('Product not found');
    alert('해당 제품을 찾을 수 없습니다.');
    const productResult = document.getElementById('productResult');
    if (productResult) productResult.classList.add('hidden');
  }
}

// 제품 결과 표시
function showProductResult(product) {
  const elements = {
    productName: document.getElementById('productName'),
    productCalories: document.getElementById('productCalories'),
    productSugar: document.getElementById('productSugar'),
    productSodium: document.getElementById('productSodium'),
    productProtein: document.getElementById('productProtein'),
    productResult: document.getElementById('productResult')
  };
  
  if (elements.productName) elements.productName.textContent = product.name;
  if (elements.productCalories) elements.productCalories.textContent = product.calories + 'kcal';
  if (elements.productSugar) elements.productSugar.textContent = product.sugar + 'g';
  if (elements.productSodium) elements.productSodium.textContent = product.sodium + 'mg';
  if (elements.productProtein) elements.productProtein.textContent = product.protein + 'g';
  
  if (elements.productResult) elements.productResult.classList.remove('hidden');
  
  // 영양소 경고 확인
  checkNutritionWarning(product);
}

// 영양소 경고 확인
function checkNutritionWarning(product) {
  if (!appState.currentUser?.healthGoals) return;
  
  const todayTotals = calculateTodayTotals();
  const consumptionQuantity = document.getElementById('consumptionQuantity');
  const quantity = parseFloat(consumptionQuantity?.value || 1);
  const goals = appState.currentUser.healthGoals;
  
  const afterConsumption = {
    calories: todayTotals.calories + (product.calories * quantity),
    sugar: todayTotals.sugar + (product.sugar * quantity),
    sodium: todayTotals.sodium + (product.sodium * quantity)
  };
  
  const warnings = [];
  
  if (afterConsumption.calories > goals.dailyCalories) {
    warnings.push(`칼로리 제한량 초과: ${afterConsumption.calories}/${goals.dailyCalories}kcal`);
  }
  if (afterConsumption.sugar > goals.dailySugar) {
    warnings.push(`설탕 제한량 초과: ${afterConsumption.sugar}/${goals.dailySugar}g`);
  }
  if (afterConsumption.sodium > goals.dailySodium) {
    warnings.push(`나트륨 제한량 초과: ${afterConsumption.sodium}/${goals.dailySodium}mg`);
  }
  
  const nutritionWarning = document.getElementById('nutritionWarning');
  const warningDetails = document.getElementById('warningDetails');
  
  if (warnings.length > 0 && warningDetails && nutritionWarning) {
    warningDetails.innerHTML = warnings.map(w => `<p>${w}</p>`).join('');
    nutritionWarning.classList.remove('hidden');
  } else if (nutritionWarning) {
    nutritionWarning.classList.add('hidden');
  }
}

// 섭취 기록 (함수명 수정)
function recordConsumption() {
  if (!appState.selectedProduct) return;
  
  console.log('Recording consumption...');
  
  const product = appState.selectedProduct;
  const consumptionQuantity = document.getElementById('consumptionQuantity');
  const quantity = parseFloat(consumptionQuantity?.value || 1);
  
  const consumption = {
    id: Date.now(),
    userId: appState.currentUser.id,
    productId: product.id,
    quantity: quantity,
    date: new Date().toISOString(),
    calories: product.calories * quantity,
    sugar: product.sugar * quantity,
    sodium: product.sodium * quantity
  };
  
  // 소비 기록 추가
  appState.todayConsumptions.push(consumption);
  
  // 로컬 스토리지 업데이트
  saveToLocalStorage();
  
  // UI 업데이트
  updateDashboard();
  
  // 성공 메시지
  alert('섭취 기록이 저장되었습니다!');
  
  // 폼 초기화
  const productSearch = document.getElementById('productSearch');
  const productResult = document.getElementById('productResult');
  const nutritionWarning = document.getElementById('nutritionWarning');
  
  if (productSearch) productSearch.value = '';
  if (productResult) productResult.classList.add('hidden');
  if (nutritionWarning) nutritionWarning.classList.add('hidden');
  appState.selectedProduct = null;
}

// 채팅 초기화
function initializeChat() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  if (chatMessages.children.length <= 1) {
    // 초기 메시지만 있는 경우
    const todayTotals = calculateTodayTotals();
    const initialMessage = createAIMessage(
      `현재까지 ${todayTotals.calories}kcal를 섭취하셨습니다. 건강한 간식 선택에 대해 궁금한 점이 있으시면 언제든지 물어보세요!`
    );
    chatMessages.appendChild(initialMessage);
  }
}

// 메시지 전송
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput?.value.trim();
  if (!message) return;
  
  console.log('Sending message:', message);
  sendUserMessage(message);
  chatInput.value = '';
}

// 빠른 질문 전송
function sendQuickMessage(question) {
  console.log('Sending quick message:', question);
  sendUserMessage(question);
}

// 사용자 메시지 전송
function sendUserMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  // 사용자 메시지 추가
  const userMessage = createUserMessage(message);
  chatMessages.appendChild(userMessage);
  
  // AI 응답 생성 (시뮬레이션)
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    const aiMessage = createAIMessage(aiResponse);
    chatMessages.appendChild(aiMessage);
    
    // 스크롤을 맨 아래로
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
  
  // 스크롤을 맨 아래로
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 사용자 메시지 생성
function createUserMessage(content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${formatCurrentTime()}</div>
  `;
  return messageDiv;
}

// AI 메시지 생성
function createAIMessage(content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${formatCurrentTime()}</div>
  `;
  return messageDiv;
}

// AI 응답 생성 (시뮬레이션)
function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // 키워드 기반 응답
  if (lowerMessage.includes('칼로리')) {
    const todayTotals = calculateTodayTotals();
    return `오늘 현재까지 ${todayTotals.calories}kcal를 섭취하셨습니다. 적절한 칼로리 섭취를 위해 균형잡힌 간식을 선택하시는 것이 좋겠습니다.`;
  } else if (lowerMessage.includes('단백질')) {
    return `단백질 보충을 위해서는 견과류나 단백질바를 추천드립니다. 아몬드나 단백질바 같은 간식이 도움이 될 것 같아요!`;
  } else if (lowerMessage.includes('당분') || lowerMessage.includes('설탕')) {
    const todayTotals = calculateTodayTotals();
    return `오늘 설탕 섭취량은 ${todayTotals.sugar}g입니다. 당분 섭취를 줄이고 싶으시다면 견과류나 저당 간식을 선택해보세요.`;
  } else if (lowerMessage.includes('추천')) {
    return `현재 재고가 충분하고 건강한 간식으로는 아몬드와 그래놀라바를 추천드립니다. 둘 다 영양가가 높고 포만감도 좋아요!`;
  } else {
    return `건강한 간식 선택에 대해 더 구체적으로 알려드릴 수 있습니다. 칼로리, 영양소, 또는 특정 간식에 대해 궁금한 점이 있으시면 언제든지 물어보세요! 😊`;
  }
}

// 관리자 대시보드 업데이트
function updateAdminDashboard() {
  updateInventoryTable();
  updatePopularProducts();
  
  // 차트는 지연 로드
  setTimeout(() => {
    createDepartmentChart();
    createCostChart();
  }, 100);
}

// 재고 테이블 업데이트
function updateInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  
  const inventoryData = appData.inventory.map(inv => {
    const product = appData.products.find(p => p.id === inv.productId);
    const stockStatus = getStockStatus(inv.currentStock, inv.minStock);
    
    return {
      ...inv,
      product,
      stockStatus
    };
  });
  
  tbody.innerHTML = inventoryData.map(item => `
    <tr>
      <td>${item.product?.name || '알수없음'}</td>
      <td>${item.currentStock}개</td>
      <td>${item.minStock}개</td>
      <td><span class="stock-status ${item.stockStatus.class}">${item.stockStatus.text}</span></td>
      <td>₩${item.product?.price?.toLocaleString() || 0}</td>
    </tr>
  `).join('');
}

// 재고 상태 확인
function getStockStatus(current, minimum) {
  if (current === 0) {
    return { class: 'stock-out', text: '품절' };
  } else if (current <= minimum) {
    return { class: 'stock-low', text: '부족' };
  } else {
    return { class: 'stock-good', text: '충분' };
  }
}

// 인기 상품 업데이트
function updatePopularProducts() {
  const container = document.getElementById('popularProducts');
  if (!container) return;
  
  // 소비 데이터를 기반으로 인기도 계산 (시뮬레이션)
  const popularProducts = [
    { product: appData.products[2], sales: 45 }, // 초콜릿쿠키
    { product: appData.products[0], sales: 32 }, // 그래놀라바
    { product: appData.products[1], sales: 28 }, // 아몬드
    { product: appData.products[3], sales: 15 }  // 단백질바
  ];
  
  container.innerHTML = popularProducts.map((item, index) => `
    <div class="popular-item">
      <div class="popular-rank">${index + 1}</div>
      <div class="popular-info">
        <div class="popular-name">${item.product.name}</div>
        <div class="popular-sales">이번 달 ${item.sales}개 판매</div>
      </div>
    </div>
  `).join('');
}

// 부서별 건강 점수 차트
function createDepartmentChart() {
  const ctx = document.getElementById('departmentChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.departmentStats.map(d => d.department),
      datasets: [{
        label: '건강 점수',
        data: appData.departmentStats.map(d => d.healthScore),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// 월별 비용 차트
function createCostChart() {
  const ctx = document.getElementById('costChart');
  if (!ctx) return;
  
  // 시뮬레이션 데이터
  const monthlyData = [
    { month: '8월', cost: 180000 },
    { month: '9월', cost: 220000 },
    { month: '10월', cost: 195000 },
    { month: '11월', cost: 240000 },
    { month: '12월', cost: 275000 }
  ];
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.map(d => d.month),
      datasets: [{
        label: '간식 구매 비용 (원)',
        data: monthlyData.map(d => d.cost),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₩' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// 건강 목표 모달
function showHealthGoalsModal() {
  const modal = document.getElementById('healthGoalsModal');
  if (!modal) return;
  
  modal.classList.remove('hidden');
  
  if (appState.currentUser?.healthGoals) {
    const goals = appState.currentUser.healthGoals;
    const elements = {
      currentWeight: document.getElementById('currentWeight'),
      targetWeight: document.getElementById('targetWeight'),
      dailyCaloriesGoal: document.getElementById('dailyCaloriesGoal'),
      dailySugarLimit: document.getElementById('dailySugarLimit'),
      dailySodiumLimit: document.getElementById('dailySodiumLimit')
    };
    
    if (elements.currentWeight) elements.currentWeight.value = goals.currentWeight;
    if (elements.targetWeight) elements.targetWeight.value = goals.targetWeight;
    if (elements.dailyCaloriesGoal) elements.dailyCaloriesGoal.value = goals.dailyCalories;
    if (elements.dailySugarLimit) elements.dailySugarLimit.value = goals.dailySugar;
    if (elements.dailySodiumLimit) elements.dailySodiumLimit.value = goals.dailySodium;
  }
}

function closeHealthGoalsModal() {
  const modal = document.getElementById('healthGoalsModal');
  if (modal) modal.classList.add('hidden');
}

function saveHealthGoals(e) {
  e.preventDefault();
  
  const elements = {
    currentWeight: document.getElementById('currentWeight'),
    targetWeight: document.getElementById('targetWeight'),
    dailyCaloriesGoal: document.getElementById('dailyCaloriesGoal'),
    dailySugarLimit: document.getElementById('dailySugarLimit'),
    dailySodiumLimit: document.getElementById('dailySodiumLimit')
  };
  
  const healthGoals = {
    currentWeight: parseFloat(elements.currentWeight?.value || 75),
    targetWeight: parseFloat(elements.targetWeight?.value || 70),
    dailyCalories: parseInt(elements.dailyCaloriesGoal?.value || 2000),
    dailySugar: parseInt(elements.dailySugarLimit?.value || 25),
    dailySodium: parseInt(elements.dailySodiumLimit?.value || 2300)
  };
  
  // 사용자 데이터 업데이트
  if (appState.currentUser) {
    appState.currentUser.healthGoals = healthGoals;
  }
  
  // 로컬 스토리지 저장
  saveToLocalStorage();
  
  // 대시보드 업데이트
  updateDashboard();
  
  closeHealthGoalsModal();
  alert('건강 목표가 저장되었습니다!');
}

// 유틸리티 함수들
function formatTime(dateString) {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function formatCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 로컬 스토리지 관리
function saveToLocalStorage() {
  try {
    localStorage.setItem('enerXIzer_consumptions', JSON.stringify(appState.todayConsumptions));
    localStorage.setItem('enerXIzer_user', JSON.stringify(appState.currentUser));
    console.log('Data saved to localStorage');
  } catch (e) {
    console.warn('로컬 스토리지 저장 실패:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const savedConsumptions = localStorage.getItem('enerXIzer_consumptions');
    if (savedConsumptions) {
      appState.todayConsumptions = JSON.parse(savedConsumptions);
      console.log('Loaded consumptions from localStorage:', appState.todayConsumptions);
    }
    
    const savedUser = localStorage.getItem('enerXIzer_user');
    if (savedUser) {
      appState.currentUser = JSON.parse(savedUser);
      console.log('Loaded user from localStorage:', appState.currentUser);
    }
  } catch (e) {
    console.warn('로컬 스토리지 로드 실패:', e);
  }
}