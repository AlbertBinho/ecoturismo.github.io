/* =========================================================
   VERDE — SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       HEADER
    ===================================================== */

    const header = document.getElementById("header");

    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );



    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuButton =
        document.getElementById("menu-button");

    const navigation =
        document.getElementById("navigation");


    function closeMenu() {

        navigation.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.textContent = "☰";

        document.body.classList.remove("modal-open");

    }


    function openMenu() {

        navigation.classList.add("open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.textContent = "×";

        document.body.classList.add("modal-open");

    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    navigation.classList.contains("open");

                if (isOpen) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );

    }


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                /*
                 * O botão do calendário não deve
                 * simplesmente navegar para "#".
                 */

                if (
                    link.id !== "open-calendar" &&
                    link.id !== "open-calendar-footer"
                ) {

                    closeMenu();

                }

            });

        });



    /* =====================================================
       REVEAL AO ROLAR
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });



    /* =====================================================
       CALENDÁRIO
    ===================================================== */

    const calendarModal =
        document.getElementById("calendar-modal");

    const calendarOverlay =
        document.getElementById("calendar-overlay");

    const calendarClose =
        document.getElementById("calendar-close");

    const calendarMonth =
        document.getElementById("calendar-month");

    const calendarDays =
        document.getElementById("calendar-days");

    const previousMonth =
        document.getElementById("previous-month");

    const nextMonth =
        document.getElementById("next-month");

    const selectedDateText =
        document.getElementById("selected-date-text");

    const confirmDate =
        document.getElementById("confirm-date");


    const openCalendar =
        document.getElementById("open-calendar");

    const openCalendarCta =
        document.getElementById("open-calendar-cta");

    const openCalendarFooter =
        document.getElementById("open-calendar-footer");


    let currentDate = new Date();

    let selectedDate = null;



    /* =====================================================
       DIAS DISPONÍVEIS
       
       Você pode alterar essa parte posteriormente.
       
       Exemplo:
       "2026-08-22"
       "2026-08-29"
    ===================================================== */

    const availableDates = new Set([

        "2026-08-22",
        "2026-08-23",
        "2026-08-29",
        "2026-08-30",

        "2026-09-05",
        "2026-09-06",
        "2026-09-12",
        "2026-09-13",
        "2026-09-19",
        "2026-09-20",
        "2026-09-26",
        "2026-09-27",

        "2026-10-03",
        "2026-10-04",
        "2026-10-10",
        "2026-10-11",
        "2026-10-17",
        "2026-10-18",
        "2026-10-24",
        "2026-10-25",
        "2026-10-31",

        "2026-11-01",
        "2026-11-07",
        "2026-11-08",
        "2026-11-14",
        "2026-11-15",
        "2026-11-21",
        "2026-11-22",
        "2026-11-28",
        "2026-11-29",

        "2026-12-05",
        "2026-12-06",
        "2026-12-12",
        "2026-12-13",
        "2026-12-19",
        "2026-12-20"

    ]);



    /* =====================================================
       FORMATAR DATA
    ===================================================== */

    function formatDateKey(
        year,
        month,
        day
    ) {

        return (
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0")
        );

    }



    /* =====================================================
       FORMATAR DATA PARA O USUÁRIO
    ===================================================== */

    function formatDateBR(dateKey) {

        const [
            year,
            month,
            day
        ] = dateKey.split("-");

        const date =
            new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

        return date.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }



    /* =====================================================
       RENDER CALENDÁRIO
    ===================================================== */

    function renderCalendar() {

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        const monthName =
            currentDate.toLocaleDateString(
                "pt-BR",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        calendarMonth.textContent =
            monthName;


        calendarDays.innerHTML = "";


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();



        /* =================================================
           ESPAÇOS ANTES DO PRIMEIRO DIA
        ================================================= */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyDay =
                document.createElement("div");

            emptyDay.className =
                "calendar-day empty";

            calendarDays.appendChild(
                emptyDay
            );

        }



        /* =================================================
           DIAS DO MÊS
        ================================================= */

        const today = new Date();

        const todayKey =
            formatDateKey(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dayButton =
                document.createElement("button");


            dayButton.type = "button";

            dayButton.className =
                "calendar-day";


            const dateKey =
                formatDateKey(
                    year,
                    month,
                    day
                );


            dayButton.textContent = day;



            /* =================================================
               DIA DISPONÍVEL
            ================================================= */

            if (
                availableDates.has(dateKey)
            ) {

                dayButton.classList.add(
                    "available"
                );


                dayButton.addEventListener(
                    "click",
                    () => {

                        selectDate(
                            dateKey
                        );

                    }
                );

            } else {

                dayButton.classList.add(
                    "unavailable"
                );

                dayButton.disabled = true;

            }



            /* =================================================
               HOJE
            ================================================= */

            if (
                dateKey === todayKey
            ) {

                dayButton.classList.add(
                    "today"
                );

            }



            /* =================================================
               DATA SELECIONADA
            ================================================= */

            if (
                selectedDate === dateKey
            ) {

                dayButton.classList.add(
                    "selected"
                );

            }


            calendarDays.appendChild(
                dayButton
            );

        }

    }



    /* =====================================================
       SELECIONAR DATA
    ===================================================== */

    function selectDate(dateKey) {

        selectedDate = dateKey;


        selectedDateText.textContent =
            formatDateBR(dateKey);


        confirmDate.disabled = false;


        renderCalendar();

    }



    /* =====================================================
       ABRIR CALENDÁRIO
    ===================================================== */

    function openCalendarModal(event) {

        if (event) {
            event.preventDefault();
        }


        closeMenu();


        calendarModal.classList.add(
            "active"
        );


        calendarModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        renderCalendar();

    }



    /* =====================================================
       FECHAR CALENDÁRIO
    ===================================================== */

    function closeCalendarModal() {

        calendarModal.classList.remove(
            "active"
        );


        calendarModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    }



    /* =====================================================
       BOTÕES ABRIR
    ===================================================== */

    if (openCalendar) {

        openCalendar.addEventListener(
            "click",
            openCalendarModal
        );

    }


    if (openCalendarCta) {

        openCalendarCta.addEventListener(
            "click",
            openCalendarModal
        );

    }


    if (openCalendarFooter) {

        openCalendarFooter.addEventListener(
            "click",
            openCalendarModal
        );

    }



    /* =====================================================
       BOTÃO X
    ===================================================== */

    if (calendarClose) {

        calendarClose.addEventListener(
            "click",
            closeCalendarModal
        );

    }



    /* =====================================================
       CLICAR FORA
    ===================================================== */

    if (calendarOverlay) {

        calendarOverlay.addEventListener(
            "click",
            closeCalendarModal
        );

    }



    /* =====================================================
       MÊS ANTERIOR
    ===================================================== */

    previousMonth.addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            renderCalendar();

        }
    );



    /* =====================================================
       PRÓXIMO MÊS
    ===================================================== */

    nextMonth.addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            renderCalendar();

        }
    );



    /* =====================================================
       CONFIRMAR DATA
    ===================================================== */

    confirmDate.addEventListener(
        "click",
        () => {

            if (!selectedDate) {
                return;
            }


            alert(
                "Trilha selecionada para " +
                formatDateBR(selectedDate) +
                ".\n\nEm breve você poderá continuar com a reserva."
            );

        }
    );



    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                if (
                    calendarModal.classList.contains(
                        "active"
                    )
                ) {

                    closeCalendarModal();

                }

                if (
                    lightbox.classList.contains(
                        "active"
                    )
                ) {

                    closeLightbox();

                }

                closeMenu();

            }

        }
    );



    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item"
        );


    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightbox-image"
        );

    const lightboxCaption =
        document.getElementById(
            "lightbox-caption"
        );

    const lightboxClose =
        document.getElementById(
            "lightbox-close"
        );

    const lightboxPrev =
        document.getElementById(
            "lightbox-prev"
        );

    const lightboxNext =
        document.getElementById(
            "lightbox-next"
        );


    let currentImage = 0;


    const galleryData =
        Array.from(
            galleryItems
        ).map(item => {

            const image =
                item.querySelector("img");

            const caption =
                item.querySelector("figcaption");

            return {

                src: image.src,

                alt: image.alt,

                caption:
                    caption
                        ? caption.textContent
                        : ""

            };

        });



    function showLightbox(index) {

        if (
            index < 0
        ) {

            index =
                galleryData.length - 1;

        }


        if (
            index >= galleryData.length
        ) {

            index = 0;

        }


        currentImage = index;


        const data =
            galleryData[currentImage];


        lightboxImage.src =
            data.src;


        lightboxImage.alt =
            data.alt;


        lightboxCaption.textContent =
            data.caption;


        lightbox.classList.add(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }



    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    }



    galleryItems.forEach(
        (item, index) => {

            item.addEventListener(
                "click",
                () => {

                    showLightbox(index);

                }
            );

        }
    );


    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    lightboxPrev.addEventListener(
        "click",
        () => {

            showLightbox(
                currentImage - 1
            );

        }
    );


    lightboxNext.addEventListener(
        "click",
        () => {

            showLightbox(
                currentImage + 1
            );

        }
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );



    /* =====================================================
       TECLADO LIGHTBOX
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key === "ArrowLeft"
            ) {

                showLightbox(
                    currentImage - 1
                );

            }


            if (
                event.key === "ArrowRight"
            ) {

                showLightbox(
                    currentImage + 1
                );

            }

        }
    );


});