function fetchUserId(callback: (error: Error | null, userId?: string) => void) {
    console.log("Fetching user ID...");
    setTimeout(() => {
        const userId = "user";
        callback(null, userId);
    }, 2000);
}



function fetchUserData(userId: string, callback: (error: Error | null, userData?: { name: string; email: string }) => void) {
    console.log(`Fetching data for user ID: ${userId}`);
    setTimeout(() => {
        const userData = { name: "John Doe", email: "Shape@njbh.com" };
        callback(null, userData);
    }, 3000);
}

function savedUserLog(userName: string, userEmail: string, callback: (error: Error | null, logStatus?: string) => void) {
    console.log(`Saving log for $(userName") with $(userEmail)`);
    setTimeout(() => {
        const status = "succesfully"
        callback(null, status)
    }, 3000)
}

fetchUserId((error, userId) => {
    if (error) {
        console.error(`Error in fetching user id`, error.message);
        return;
    }
    if (userId) {
        fetchUserData(userId, (error, userData) => {
            if (error) {
                console.error("Error in fetching user details", error.message);
                return;
            }
            if (userData) {
                savedUserLog(userData.email, userData.name, (error, logStatus) => {
                    if (error) {
                        console.error("Error is user details", error.message);
                        return;
                    }
                    if (logStatus) {
                        console.log("All operations completed ")
                        console.log("Final status", logStatus);
                    }
                })
            }
        })
    }
})