export function Footer() {
    return (
        <footer className="border-t bg-secondary/30 mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:flex-row px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 BeautySearch. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    )
}
