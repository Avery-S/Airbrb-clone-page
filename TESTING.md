UI test:
1.Registers successfully and logout
Visit website 'http://localhost:3000/register' we can access register page. Enter register information (register-email, register-name, register-password, register-password-confirm). Click 'Register' button then it will take us to main page('/'). Click '.MuiAvatar-root' and it will show 'Logout'. Click 'Logout' to logout and it will show 'You have successfully logout out!'.

2.Creates a new listing successfully
Navigate to 'http://localhost:3000/login' and log in using credentials (testing1@gmail.com, testing).
After successful login, click on 'My Hosted Listings' which redirects to '/my-hosted-listings'.
Click 'Create My Listing', a form appears for creating a new listing.
Fill in the listing details: title, address, pricing, property type, number of bathrooms, rooms, and beds, select tags, and write house rules.
Click 'Create Listing'. Verify that the new listing 'Test Hotel 3' with the specified details appears on the page.

3.Updates the thumbnail and title of the listing successfully
Click the 'Edit Listing' button (appers as a blue pencil icon)for a specific listing.
Upload a new image ('hotel.jpeg') and update the title to 'Test Hotel 4'.
Click 'Update Listing' and verify that the listing now shows the updated thumbnail and title on the 'My Hosted Listings' page.

4.Publish a listing successfully
Click the button at the right down corner (appers as a tick icon) to set availability dates for the listing.
Set and confirm the availability dates.
Click 'Publish'. Verify that the listing is now published, indicated by the color change of the 'Published' button and the card shadow turning green. Also we can find the card in the All Listings page.

5.Unpublish a listing successfully
Click the 'If published' button for a listing.
Click 'Unpublish', confirm the action, and verify that the listing is now unpublished, indicated by the color change of the 'Published' button and the card shadow.

6.Logs out of the application successfully
Click on '.MuiAvatar-root' to open the user menu.
Click 'Logout' and verify the message 'You have successfully logout out!' appears, indicating successful logout.

7.Logs back into the application successfully
Visit the login page and log in using the same credentials.
Verify redirection to the main page after successful login.
Log out and then log back in to confirm that the login functionality works consistently.

8.Make a booking successfully
Log in as customer and navigate to 'All Listings'.
Find and click on 'Test Hotel 4' to view its details.
Click 'Book' and set the booking dates using the calendar interface.
Confirm the booking and verify that the success message and the booking details are displayed, indicating a successful booking process.