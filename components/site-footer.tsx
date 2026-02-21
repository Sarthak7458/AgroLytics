"use client";

import { useLanguage } from "@/app/context/language-context";

export function SiteFooter() {
    const { t } = useLanguage();
    return (
        <footer className="border-t bg-green-50/50 dark:bg-green-950/20">
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-900 dark:text-green-400">{t("footer.brand")}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t("footer.brandDesc")}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">{t("footer.product")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.features")}</a></li>
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.pricing")}</a></li>
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.api")}</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">{t("footer.resources")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.documentation")}</a></li>
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.blog")}</a></li>
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.community")}</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">{t("footer.legal")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.privacy")}</a></li>
                            <li><a href="#" className="hover:text-green-700 dark:hover:text-green-400">{t("footer.terms")}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {t("footer.copyright")}
                </div>
            </div>
        </footer>
    );
}
