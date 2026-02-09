

  function selectVariant() {
    let option1 = document.querySelector('.option[data-position="1"].active')?.getAttribute('data-value') || undefined;
    let option2 = document.querySelector('.option[data-position="2"].active')?.getAttribute('data-value') || undefined;
    let option3 = document.querySelector('.option[data-position="3"].active')?.getAttribute('data-value') || undefined;

    let selectedVariant = null;
    let product = window.current_open_product || null;

    if (product) {
      for (let variant of product.variants) {
        let variantOption1 = variant.options[0];
        let variantOption2 = variant.options[1];
        let variantOption3 = variant.options[2];
        if (variantOption1 == option1 && variantOption2 == option2 && variantOption3 == option3) {
          selectedVariant = variant;
          break;
        }
      }
    }
    if (selectedVariant) {
      if (
        selectedVariant.options.map((option) => String(option).toLowerCase()).includes('black') &&
        selectedVariant.options.map((option) => String(option).toLowerCase()).includes('m')
      ) {
        const addToCartBtn = document.querySelector('add-to-cart-button');
        if (addToCartBtn) {
          addToCartBtn.setAttribute('data-variant-id-gift', '51797682651499');
        }
      }
      const addToCartBtn = document.querySelector('add-to-cart-button');
      if (addToCartBtn) {
        addToCartBtn.setAttribute('data-variant-id', selectedVariant.id);
        addToCartBtn.setAttribute('data-price', selectedVariant.price);
      }
    } else {
      const addToCartBtn = document.querySelector('add-to-cart-button');
      if (addToCartBtn) {
        addToCartBtn.setAttribute('data-variant-id', '');
        addToCartBtn.setAttribute('data-price', '');
      }
    }
    return selectedVariant;
  }

  function selectOption(selected) {
    const options = document.querySelector('.options');
    const position = selected.getAttribute('data-position');
    const allOptions = document.querySelectorAll('.option[data-position="' + position + '"]');

    
    allOptions.forEach((option, index) => {
      option.classList.remove('active');
    });

  
    selected.classList.add('active');

    
    const selectedIndex = Array.from(allOptions).indexOf(selected) + 1;
    if (options) {
      options.setAttribute('data-active', String(selectedIndex));
    }

    selectVariant();
  }




  document.querySelectorAll('.plus-icon, .plus-icon-mobile').forEach((icon) => {
    icon.addEventListener('click', function () {
      const modal_container = document.querySelector('.modal_container');
      const overlay = document.querySelector('.overlay');

      if (modal_container && modal_container instanceof HTMLElement) {
        modal_container.style.display = 'flex';
      }
      document.body.style.overflowY = 'hidden';

     
      const productDataString = this.getAttribute('data-product');

      const productDescriptionString = this.getAttribute('data-description');
      const productDescription = modal_container?.querySelector('.product-description');
      if (productDescription) {
        productDescription.innerHTML = productDescriptionString;
      }

     
      try {
        const productData = JSON.parse(productDataString);
        if (!window.current_open_product) {
          window.current_open_product = {};
        }
        window.current_open_product = productData;
       

        const productImage = modal_container?.querySelector('.product-image');
        if (productImage && productImage instanceof HTMLImageElement) {
          productImage.src = productData.image; 
        }
        const productTitle = modal_container?.querySelector('.prduct-title');
        if (productTitle) {
          productTitle.textContent = productData.title; 
        }
        const productPrice = modal_container?.querySelector('.product-price');
        if (productPrice) {
          productPrice.textContent = productData.price;
        }

        let colorOptionsHtml = '';
        let sizeOptionsHtml = '';

        for (let option of productData.options) {
          if (option.name.toLowerCase() == 'color') {
            for (const value of option.values) {
              colorOptionsHtml += `<div class="option" data-position="${
                option.position
              }" data-color="${value.toLowerCase()}" 
               data-value="${value}"  
              onclick="selectOption(this)">${value}</div>`;
            }
          } else if (option.name.toLowerCase() == 'size') {
            for (const value of option.values) {
              sizeOptionsHtml += `<li class="option" data-position="${option.position}" data-value="${value}" 
              onclick="selectOption(this)"
              > ${value}</li>`;
            }
          }
        }

        let variant_container_html = `
          <label for="color" class="color-title">
            Color
          </label>
          <div class="options">
          ${colorOptionsHtml}
          </div>
        `;

        let dropdown_container_html = `<label for="sizeDropdown">Size</label>
        <button id="dropdownDefaultButton" class="dropdown-button">
          Choose your size
          <span class="dropdown-arrow">
            <svg
              id="dropdownArrow"
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 2L8 8L14 2" stroke="black" stroke-width="1.5"
                stroke-linecap="square" />
            </svg>
          </span>
        </button>
        <div id="dropdown" class="dropdown-menu hidden">
          <ul>
          ${sizeOptionsHtml}
          </ul>
        </div>
`;

        const variantContainer = modal_container?.querySelector('.variant-container');
        if (variantContainer && colorOptionsHtml !== '') {
          variantContainer.innerHTML = variant_container_html; // Update the HTML content
        }
        const dropdownContainer = modal_container?.querySelector('.dropdown-container');
        if (dropdownContainer && sizeOptionsHtml !== '') {
          dropdownContainer.innerHTML = dropdown_container_html; // Update the HTML content
        }

      
        const dropdownButton = document.getElementById('dropdownDefaultButton');
        const dropdownMenu = document.getElementById('dropdown');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const dropdownArrow = document.getElementById('dropdownArrow');
        const listItems = dropdownMenu?.querySelectorAll('li');

       
        if (dropdownButton && dropdownMenu && dropdownArrow) {
          dropdownButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
            dropdownArrow.classList.toggle('rotate');
          });
        }

        if (listItems) {
          listItems.forEach((item) => {
            item.addEventListener('click', function () {
              if (dropdownButton && dropdownButton.firstChild && dropdownMenu && dropdownArrow) {
                dropdownButton.firstChild.textContent = `${this.textContent} `;
                dropdownMenu.classList.add('hidden'); 
                dropdownArrow.classList.remove('rotate');
              }
            });
          });
        }

     
        document.addEventListener('click', (e) => {
          const target = e.target;
          if (dropdownButton && dropdownMenu && dropdownArrow && target instanceof Node) {
            if (!dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
              dropdownMenu.classList.add('hidden');
              dropdownArrow.classList.remove('rotate');
            }
          }
        });
      } catch (error) {
        console.error('Error parsing product data:', error);
      }

      const crossBtn = document.querySelector('.cross-btn');
      if (crossBtn && modal_container instanceof HTMLElement) {
        crossBtn.addEventListener('click', function () {
          modal_container.style.display = 'none';
          document.body.style.overflowY = 'auto';
        });
      }

      if (overlay && modal_container instanceof HTMLElement) {
        overlay.addEventListener('click', function () {
          modal_container.style.display = 'none';
          document.body.style.overflowY = 'auto';
        });
      }
    });
  });



  class AddToCartButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['data-variant-id', 'data-price', 'data-label'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    disconnectedCallback() {
      if (this.shadowRoot) {
        const button = this.shadowRoot.querySelector('button');
        if (button) {
          button.removeEventListener('click', this.addToCart);
        }
      }
    }

    render() {
      let buttonLabel = this.getAttribute('data-label') || 'Add to Cart';
      const variantIdStr = this.getAttribute('data-variant-id');
      let variantId = variantIdStr ? parseInt(variantIdStr, 10) : 0;

      let priceStr = this.getAttribute('data-price');
      let priceDisplay = '';
      if (priceStr) {
        const priceNum = parseFloat(priceStr) / 100;
        priceDisplay = `$${priceNum.toFixed(2)}`;
      }

      if (!variantId) {
        buttonLabel = 'Select Variant';
      }

      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
      <style>
       .add-to-cart-btn {
        margin-top: 51px;
        margin-bottom: 25px;
        padding-left: 20px;
        padding-right: 20px;
      }

      .cart-button {
        width: 271px;
        color:white;
        height: 45px;
        font-size:16px;
        font-family: 'jost';
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 28px;
        background-color: black;
        border: none;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 51px;
        margin-bottom: 25px;
     }
      </style>
       <button class="cart-button" >
        <a style="color:white">${buttonLabel} </a>
        <svg 
          width="36"
          height="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.4093 5.25L0.659302 5.25L0.659302 6.75L1.4093 6.75L1.4093 5.25ZM35.6391 6.53033C35.932 6.23744 35.932 5.76257 35.6391 5.46967L30.8661 0.696701C30.5733 0.403808 30.0984 0.403808 29.8055 0.696701C29.5126 0.989594 29.5126 1.46447 29.8055 1.75736L34.0481 6L29.8055 10.2426C29.5126 10.5355 29.5126 11.0104 29.8055 11.3033C30.0984 11.5962 30.5732 11.5962 30.8661 11.3033L35.6391 6.53033ZM1.4093 6.75L35.1088 6.75L35.1088 5.25L1.4093 5.25L1.4093 6.75Z"
            fill="white" />
        </svg>
      </button>
      
    `;
      }

      if (this.shadowRoot) {
        const cartButton = this.shadowRoot.querySelector('button.cart-button');
        if (cartButton) {
          cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.addToCart(e);
          });
        }
      }
    }
    
    async shopifyAddtoCart(variantId, quantity, giftId) {
      let params;

      if (giftId) {
        params = {
          items: [
            { id: parseInt(variantId, 10), quantity },
            { id: parseInt(giftId, 10), quantity: 1 }
          ]
        };
      } else {
        params = {
          id: parseInt(variantId, 10),
          quantity
        };
      }

      console.log("params being sent", params);

      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
    }

    async addToCart(event) {
      event.preventDefault();
      const gift_variant_id = this.getAttribute('data-variant-id-gift');
      const variantId = this.getAttribute('data-variant-id');
      const price = this.getAttribute('data-price');
      if (!variantId || !price) {
        console.error('Missing required attributes: data-variant-id or data-price');
        return;
      }

      try {
        let response = await this.shopifyAddtoCart(variantId, 1, gift_variant_id);
        if (!response.ok) {
          throw new Error(`Failed to add to cart: ${response.statusText}`);
        }

        const cartData = await response.json();
        console.log('Product added to cart:', cartData);

        location.href = '/cart';
      } catch (error) {
        alert(error.message);
        console.error('Error adding to cart:', error);
      }
    }
  }
  
