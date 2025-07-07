document.addEventListener("DOMContentLoaded", () => {
    const nextStepButtons = document.querySelectorAll(".next-step");
    const prevStepButtons = document.querySelectorAll(".prev-step");

    // Function to update the review section
    function updateReviewSection() {
        document.getElementById("reviewName").textContent = document.getElementById("tokenName").value || "N/A";
        document.getElementById("reviewSymbol").textContent = document.getElementById("tokenSymbol").value || "N/A";
        document.getElementById("reviewDecimals").textContent = document.getElementById("tokenDecimals").value || "N/A";
        document.getElementById("reviewSupply").textContent = document.getElementById("tokenSupply").value || "N/A";
        document.getElementById("reviewDescription").textContent = document.getElementById("tokenDescription").value || "N/A";
        document.getElementById("reviewWebsite").textContent = document.getElementById("tokenWebsite").value || "N/A";
        document.getElementById("reviewTwitter").textContent = document.getElementById("tokenTwitter").value || "N/A";
        document.getElementById("reviewTelegram").textContent = document.getElementById("tokenTelegram").value || "N/A";

        const imagePreview = document.getElementById("imagePreview");
        const reviewImage = document.getElementById("reviewImage");
        if (imagePreview.src && imagePreview.style.display !== "none") {
            reviewImage.src = imagePreview.src;
            reviewImage.style.display = "block";
        } else {
            reviewImage.style.display = "none";
        }
    }

    // Event listeners for navigation buttons
    nextStepButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const currentStep = e.target.closest(".form-step");
            const nextStep = currentStep.nextElementSibling;

            if (nextStep) {
                currentStep.style.display = "none";
                nextStep.style.display = "block";

                // Update review section if transitioning to Step 3
                if (nextStep.dataset.step === "3") {
                    updateReviewSection();
                }
            }
        });
    });

    prevStepButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const currentStep = e.target.closest(".form-step");
            const prevStep = currentStep.previousElementSibling;

            if (prevStep) {
                currentStep.style.display = "none";
                prevStep.style.display = "block";
            }
        });
    });
});