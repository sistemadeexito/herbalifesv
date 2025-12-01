(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	})

	$('.owl-banner').owlCarousel({
	  center: true,
      items:1,
      loop:true,
      nav: true,
	  dots:true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
		1200:{
			items:1
		}
      }
	});

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	})

	const elem = document.querySelector('.properties-box');
	const filtersElem = document.querySelector('.properties-filter');
	if (elem) {
		const rdn_events_list = new Isotope(elem, {
			itemSelector: '.properties-items',
			layoutMode: 'masonry'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'a')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				rdn_events_list.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.is_active').classList.remove('is_active');
				event.target.classList.add('is_active');
				event.preventDefault();
			});
		}
	}


	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});
    


})(window.jQuery);

//ALL CLICKEABLE

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-href]').forEach(container => {
      const href = container.getAttribute('data-href');
      container.style.cursor = "pointer";
      container.addEventListener('click', function () {
        window.location.href = href;
      });
    });
  });




  
//RECIBIR Y MARCAR

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const valor = params.get('valor');

  if (!valor) return;

  // Buscar la caja con ese data-valor
  const caja = document.querySelector(`.caja[data-valor="${CSS.escape(valor)}"]`);

  if (caja) {
    document.querySelectorAll('.caja').forEach(c => c.classList.remove('seleccionado'));
    caja.classList.add('seleccionado');

    // --- NUEVO: asegurar que el contador refleje la selección ---
    const cantidadInput = caja.querySelector('.input-cantidad');
    if (cantidadInput) {
      // si estaba en 0 o vacío, darle valor por defecto 1
      if (!cantidadInput.value || parseInt(cantidadInput.value, 10) === 0) {
        cantidadInput.value = 1;
      }
    }

    // Actualizar input oculto y total como si el usuario hubiera interactuado
    if (typeof actualizarInputHidden === 'function') actualizarInputHidden();
    if (typeof actualizarPrecioTotal === 'function') actualizarPrecioTotal();
    // -----------------------------------------------------------

    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});



// CAJAS ENVIO
const cajas = document.querySelectorAll(".selector-cajas .caja");
const inputDiseno = document.getElementById("diseno");

cajas.forEach(caja => {
  caja.addEventListener("click", () => {
    caja.classList.toggle("seleccionado");
    const cantidadInput = caja.querySelector(".input-cantidad");

    if (caja.classList.contains("seleccionado")) {
      cantidadInput.value = 1;
    } else {
      cantidadInput.value = 0;
    }

    // Actualizar input oculto con resumen
    const seleccionados = Array.from(document.querySelectorAll(".caja.seleccionado"))
      .map(c => {
        const cantidad = c.querySelector(".input-cantidad").value;
        return `${c.dataset.valor} (x${cantidad})`;
      });

    inputDiseno.value = seleccionados.join(", ");

    // ✅ Nuevo: Actualiza total cada vez que haces click
    actualizarPrecioTotal();
  });
});

// CAJAS COUNTER
document.querySelectorAll('.input-cantidad').forEach(input => {
  let valorAnterior = "";

  input.addEventListener('click', function (e) {
    e.stopPropagation(); // No deseleccionar la caja
  });

  input.addEventListener('focus', function () {
    valorAnterior = this.value;
    this.value = "";
  });

  input.addEventListener('blur', function () {
    if (this.value.trim() === "") {
      this.value = valorAnterior || 1;
    }
    actualizarPrecioTotal(); // Por si editaste y borraste
  });

  input.addEventListener('input', function () {
    const caja = this.closest('.caja');

    if (!caja.classList.contains('seleccionado') && parseInt(this.value) > 0) {
      caja.classList.add('seleccionado');
    }

    actualizarInputHidden();
    actualizarPrecioTotal(); // ✅ Actualiza cuando editas manualmente
  });

  input.addEventListener('change', function () {
    actualizarInputHidden();
    actualizarPrecioTotal(); // ✅ Actualiza cuando pierdes foco
  });
});

function actualizarInputHidden() {
  const seleccionados = Array.from(document.querySelectorAll(".caja.seleccionado"))
    .map(c => {
      const cantidadInput = c.querySelector(".input-cantidad");
      const cantidad = cantidadInput ? cantidadInput.value : 1;
      return `${c.dataset.valor} (x${cantidad})`;
    });

  document.getElementById("diseno").value = seleccionados.join(", ");
}
// ==========================================
//  LÓGICA DE CÁLCULO DE PRECIO Y PESO
// ==========================================

// Esta función se llama cada vez que tocas una caja o cambias un número
function actualizarPrecioTotal() {
  let total = 0;
  let totalUnidades = 0;
  let totalPesoGramos = 0;

  // Recorrer todas las cajas para sumar
  document.querySelectorAll('.caja').forEach(caja => {
    // Obtenemos precio y peso (Si no tiene peso, asume 0)
    const precioUnitario = parseFloat(caja.dataset.precio) || 0;
    const pesoUnitario = parseFloat(caja.dataset.peso) || 0; 
    
    // Obtenemos la cantidad dentro del input
    const inputCant = caja.querySelector('.input-cantidad');
    const cantidad = inputCant ? (parseInt(inputCant.value) || 0) : 0;

    if (cantidad > 0) {
        total += cantidad * precioUnitario;
        totalUnidades += cantidad;
        totalPesoGramos += cantidad * pesoUnitario;
    }
  });

  // --- Lógica de Descuentos ---
  let descuentoPorc = 0;
  if (totalUnidades >= 6 && totalUnidades < 10) {
    descuentoPorc = 5;
  } else if (totalUnidades === 10) {
    descuentoPorc = 10;
  } else if (totalUnidades > 10) {
    descuentoPorc = 15;
  }

  let descuento = total * (descuentoPorc / 100);
  let totalFinal = total - descuento;

  // --- Mostrar en pantalla ---
  
  // 1. Precio
  const precioEl = document.getElementById('precioTotal');
  if(precioEl) precioEl.textContent = totalFinal.toFixed(2);

  // 2. Peso (Convertido a KG)
  const pesoEl = document.getElementById('pesoTotal');
  if(pesoEl) {
      let pesoKg = totalPesoGramos / 1000;
      pesoEl.textContent = pesoKg.toFixed(2);
  }

  // 3. Texto del descuento
  const descuentoInfo = document.getElementById('descuentoInfo');
  if (descuentoInfo) {
      if (descuentoPorc > 0) {
        descuentoInfo.textContent = `¡Descuento aplicado: ${descuentoPorc}% (-$${descuento.toFixed(2)})!`;
      } else {
        descuentoInfo.textContent = "";
      }
  }
}

// Función para el botón de WhatsApp
function enviarWhatsApp() {
  const productoEl = document.getElementById("producto");
  const producto = productoEl ? productoEl.innerText : "Pedido";
  
  const detalleEl = document.getElementById("detalle");
  const detalle = detalleEl ? detalleEl.value.trim() : "";

  let disenoDetalle = "";
  let total = 0;
  let totalUnidades = 0;
  let totalPesoGramos = 0;

  document.querySelectorAll('.caja').forEach(caja => {
    const nombre = caja.dataset.valor;
    const precio = parseFloat(caja.dataset.precio) || 0;
    const peso = parseFloat(caja.dataset.peso) || 0;
    
    const inputCant = caja.querySelector('.input-cantidad');
    const cantidad = inputCant ? (parseInt(inputCant.value) || 0) : 0;

    if (cantidad > 0) {
      const subtotal = cantidad * precio;
      disenoDetalle += `• ${nombre} x${cantidad} = $${subtotal.toFixed(2)}\n`;
      total += subtotal;
      totalUnidades += cantidad;
      totalPesoGramos += cantidad * peso;
    }
  });

  if (disenoDetalle === "") {
    alert("⚠️ Por favor, selecciona al menos un producto.");
    return;
  }

  // Recalcular descuento para el mensaje
  let descuentoPorc = 0;
  if (totalUnidades >= 6 && totalUnidades < 10) descuentoPorc = 5;
  else if (totalUnidades === 10) descuentoPorc = 10;
  else if (totalUnidades > 10) descuentoPorc = 15;

  let descuento = total * (descuentoPorc / 100);
  let totalFinal = total - descuento;
  let pesoKg = totalPesoGramos / 1000;

  // Construir mensaje
  let mensaje = `📦 *Pedido ÉXITO*\n\n` +
                `🧸 *Producto:* ${producto}\n` +
                `🎨 *SKU seleccionado(s):*\n${disenoDetalle}` +
                `📦 *Unidades:* ${totalUnidades}\n` +
                `⚖️ *Peso Total:* ${pesoKg.toFixed(2)} kg\n`;

  if (descuentoPorc > 0) {
    mensaje += `✅ *Descuento:* ${descuentoPorc}% (-$${descuento.toFixed(2)})\n`;
  }

  mensaje += `💵 *Total a pagar:* $${totalFinal.toFixed(2)}`;

  if (detalle !== "") {
    mensaje += `\n\n📝 *Detalle:* ${detalle}`;
  }

  let url = `https://wa.me/+50376106996?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}