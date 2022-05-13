export default function DownloadPass() {
    console.log('/download-pass')
    return (
        <div className="container">
            <main>
                <h1 className="title">
                    Download Pass
                </h1>

                <button>
                    Connect wallet
                </button>
                
                <p></p>

                <a href="/api/downloadPass">
                    <button>
                        Download pass
                    </button>
                </a>
            </main>
        </div>
    )
}
