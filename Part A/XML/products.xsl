<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html"/>
    <xsl:template match="/category">
        <div class="container">
            
            <xsl:for-each select="product">
                <div class="d-flex justify-content-center mb-5">
                    <div class="card index_card w-100">
                        <div class="card-body d-flex flex-column justify-content-center">
                            <span class="card-title text-center"><xsl:value-of select="name" /><br />
                            CODE: <b><xsl:value-of select="@code" /></b></span>
                            <ul>
                                <li><b>Description: </b> <xsl:value-of select="description" /></li>
                                <li><b>Quantity: </b> <xsl:value-of select="quantity" /></li>
                                <li><b>Unit Price: </b> $<xsl:value-of select="unit_price" /></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>