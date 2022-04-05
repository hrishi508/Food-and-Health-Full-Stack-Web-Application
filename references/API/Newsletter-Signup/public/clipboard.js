async function hitarth() 
{
    try {

        await navigator.clipboard.writeText("Just a prank don't worry :)");
        alert("Malicious content has been copied to your clipboard!");

    } 
    
    catch (err) {
        console.error('Failed to copy: ', err);
    }
}

hitarth();